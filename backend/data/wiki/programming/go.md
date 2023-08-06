# Go

## theory
- go uses no blocking c-libraries. io, http etc are all non-blocking.
- the language is designed so that even the synchronous appearing APIs for things like file IO actually use the non-blocking system calls under the hood, so that the OS thread does not get blocked, and other goroutines can be scheduled.
- IO calls don't look special (no await, no yield, no special keyword, no callback), that is to say they behave like any other function call (although the implementation of these io calls is non-blocking to allow other green threads to run). Concurrent io from the programmer perspective is achieved simply by spawning many green threads/actors.


## system 
- goroot: 
	- default: `/usr/local/go`
	- where go binaries are located
	- set this when installing go in a custom location
- gopath: 
	- default: `~/go`
	- where go source-codes are located
	- 

## setup and packages

- package: directory of .go files
- module: collection of packages + dependencies and versioning
- find modules at `https://pkg.go.dev/`


structure:
- mymodule
	- mypackage1
		- file1.go
		- file2.go
	- mypackage2
		- file3.go
		- file4.go
	<mainfilename>.go
	go.mod  		<---- like package.json
	go.sum			<---- like package-lock.json


- init: `go mod init <module-name>`  (commonly named `github.com/michaellangbein/<mymodule>`)
- create a package inside your project: `touch <mypackage>/<filename>.go`
- import: `import "github.com/michaellangbein/<mymodule>/<mypackage>`  .... imports all public stuff in all files in this package.
	- there is no relative import.


- run: `go run .`
- install specific package:  `go get -u gonum.org/v1/gonum/`
- install all packages found in code: `go mod tidy`
- create binary: `go build`
- create binary and deploy to your local machine: `go install`
	- find the local deployment-target with `go list -f {{.Target}}`


- replace: have go look up dependencies on some local path instead of online: `go mod edit -replace example.com/greetings=../greetings`


## testing 

- Any file that ends with `_test.go`
- Any function starting with `Test`
- `go test`


## primitives 
```go
// constants. don't need := , because they are always declared and assigned at the same time.
const earthRadius = float64(6371)
// slice. like array, but you can add and remove data
values := []float64{1, 2, 3, 4, 5, 6}
for index, value := range values {
	...
}
// map
values := make(map[string]int32)
for key, val := range values {
	...
}
```

## structs
```go
type CartesianPlaneData struct {
	x, y float64
}

// instantiating structs
myCoord := CartesianPlaneData{11.23, 54.21}
someMap := map[string]bool{"entry1": true, "entry2": false}
// instantiating without assigning values
someCoord := make(CartesianPlaneData)
yourMap   :=  make(map[string]bool)
```

## interfaces
```go
type CoordinateData interface {
	calculateDistance(latTo, lonTo float64) float64
}

// read: to struct `CartesianPlaneData` add the function `calculateDistance`.
// no need for `implements` anywhere - interfaces are implemented implicitly.
func (d CartesianPlaneData) calculateDistance(xTo, yTo float64) float64 {
	dx := (xTo - d.x)
	dy := (yTo - d.y)
	return math.Sqrt( dx*dx + dy*dy )
}


func main() {
    pointA := CartesianPlaneData{1, 1}
	distanceA := pointA.calculateDistance(5, 5) 
}

```

## generics
https://go.dev/doc/tutorial/generics


## anonymous functions and closures

```go
func handleCallback(callback func(val int) string) string {
	value := 42
	response := callback(value)
	return response
}

func callback(val int) string {
	return fmt.Sprintf("the value was %v", val)
}

func main() {
	result := handleCallback(callback)
	fmt.Println(result)
}
```


## channels

`cap` and `close` keywords:
```go
capacity := 10
ch := make(chan int, capacity)
capacityVerified := cap(ch)

ch <- 1
ch <- 2
close(ch)   // only the sender should close a channel, never the receiver.

val, ok <- ch
if ok == false {
	fmt.Println("error")
}

// range will keep fetching until `val, ok <- ch` has `ok == false` - which is true only when the channel is closed
for v := range(ch) {  
	fmt.Println(v)
}
```


Receiving from channels is blocked until data arrives:
```go
func streamData(output chan int) {
	for i := 0; i < 10; i++ {
		time.Sleep(500 * time.Millisecond)
		output <- i
	}
	close(output)   // required so that range doesn't run into an empty value
}


func main() {
	input := make(chan int, 3)
	go streamData(input)

	// range is being blocked until stream data delivers new data
	for value := range(input) {
		fmt.Println(value)
	}
}
```

Pushing into channels is blocked until capacity is free:
```go
func streamData(output chan int) {
	for i := 0; i < 10; i++ {
		time.Sleep(10 * time.Millisecond)
		// stream is being blocked until receiver can accept more
		fmt.Println(fmt.Sprintf(`pushing %v`, i))
		output <- i
	}
	close(output)
}


func main() {
	input := make(chan int, 3)

	go streamData(input)

	for {
		time.Sleep(100 * time.Millisecond)
		val, ok := <- input
		if ok != true {
			return
		}
		fmt.Println(fmt.Sprintf(`receiving %v`, val))
	} 
}
```


A select blocks until one of its cases can run, then it executes that case. It chooses one at random if multiple are ready. 
```go
func streamData(controlInput chan string, dataOutput chan int) {
	value := 0
	for {
		select {
		case dataOutput <- value:
			value += 1
		case command, _ := <- controlInput:
			if command == "stop" {
				close(dataOutput)
				return
			}
		}
	}
}


func main() {
	controlChannel := make(chan string)
	resultChannel := make(chan int)
	go streamData(controlChannel, resultChannel)

	for value := range resultChannel {
		if value > 10 {
			controlChannel <- "stop"
		}
		fmt.Println(value)
	}
}
```


Once a channel has been closed, it is considered "available for communication" by select (weirdly).
So it would fire infinitely. To prevent this from happening, `nil` them out:
```go
func streamData1(dataOutput chan int) {
	defer close(dataOutput)
	for i := 0; i < 10; i++ {
		time.Sleep(100 * time.Millisecond)
		dataOutput <- i
	}
}

func streamData2(dataOutput chan int) {
	defer close(dataOutput)
	for i := 0; i < 10; i++ {
		time.Sleep(200 * time.Millisecond)
		dataOutput <- i * 10
	}
}


func main() {
	inputCh1 := make(chan int, 3)
	inputCh2 := make(chan int, 3)

	go streamData1(inputCh1)
	go streamData2(inputCh2)

	for {
		select {
		case val, ok := <- inputCh1:
			if ok != true { inputCh1 = nil }
			fmt.Println(fmt.Sprintf(`channel 1: %v`, val))
		case val, ok := <- inputCh2:
			if ok != true { inputCh2 = nil }
			fmt.Println(fmt.Sprintf(`channel 2: %v`, val))
		}
		if inputCh1 == nil && inputCh2 == nil {
			break
		}
	}
}
```





## file io


## http
```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
)

type Fetcher struct {
	r *regexp.Regexp
}

func (f Fetcher) Fetch(url string) (body string, urls []string, err error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()

	bodyBytes, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		return "", nil, err
	}
	bodyString := string(bodyBytes)

	matches := f.r.FindAllString(bodyString, -1)

	return bodyString, matches, nil
}

func CrawlNaive(url string, depth int, fetcher Fetcher) {

	if depth <= 0 {
		return
	}

	fmt.Printf("fetching url %s ...\n", url)
	_, urls, err := fetcher.Fetch(url)
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, u := range urls {
		CrawlNaive(u, depth-1, fetcher)
	}
}

func CrawlSync(url string, depth int, fetcher Fetcher, urlCache *map[string]bool) {

	if depth <= 0 {
		return
	}

	fmt.Printf("fetching url %s ...\n", url)
	_, urls, err := fetcher.Fetch(url)
	if err != nil {
		fmt.Println(err)
		return
	}
	(*urlCache)[url] = true

	for _, u := range urls {
		_, ok := (*urlCache)[u]
		if !ok {
			(*urlCache)[u] = false
			CrawlSync(u, depth-1, fetcher, urlCache)
		}
	}
}

func CrawlSingleAsync(url string, fetcher *Fetcher) <-chan []string {
	out := make(chan []string)

	go func() {
		defer close(out)
		fmt.Printf("fetching url %s ...\n", url)

		_, urls, err := (*fetcher).Fetch(url)

		if err != nil {
			// fmt.Println(err)
			return
		}

		out <- urls
	}()

	return out
}

func CrawlAll(baseUrl string, maxDepth int, fetcher *Fetcher) []string {

	urlsCache := map[string]bool{baseUrl: false}

	for d := 0; d <= maxDepth; d++ {

		// step 1: for all missing entries in urlCache, get a channel to their results
		inputs := make([](<-chan []string), 0)
		for url, fetched := range urlsCache {
			if !fetched {
				input := CrawlSingleAsync(url, fetcher)
				urlsCache[url] = true
				inputs = append(inputs, input)
			}
		}

		// step 2: collect all data from the channels, add urls to urlCache
		for _, input := range inputs {
			newUrls := <-input
			for _, newUrl := range newUrls {
				_, present := urlsCache[newUrl]
				if !present {
					urlsCache[newUrl] = false
				}
			}
		}
	}

	urlsDone := make([]string, 0)
	for url, fetched := range urlsCache {
		if fetched {
			urlsDone = append(urlsDone, url)
		}
	}
	return urlsDone
}

func main() {
	baseUrl := "https://golang.org/"
	r, _ := regexp.Compile(`https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?`)
	fetcher := Fetcher{r}
	results := CrawlAll(baseUrl, 2, &fetcher)
	fmt.Println(len(results))
}

```



## numeric
https://github.com/gonum/gonum
https://www.freecodecamp.org/news/scientific-computing-in-golang-using-gonum/

## Gdal
https://github.com/lukeroth/gdal
... actually, might be better for asynchronously reading parts of cogs: https://github.com/airbusgeo/godal

## Geotiff's

## COG's

## db's