# Go

## setup and packages
- installing packages:  `go get -u gonum.org/v1/gonum/`

## primitves 
```go
const earthRadius = float64(6371)
values := []float64{1, 2, 3, 4, 5, 6}
```

## structs
```go
type CartesianPlaneData struct {
	x, y float64
}
```

## interfaces
```go
type CoordinateData interface {
	calculateDistance(latTo, lonTo float64) float64
}

// read: to struct `CartesianPlaneData` add the function `calculateDistance`.
// no need for `implements` anywhere.
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

## async await

## numeric
https://github.com/gonum/gonum
https://www.freecodecamp.org/news/scientific-computing-in-golang-using-gonum/

## Gdal
https://github.com/lukeroth/gdal

## Geotiff's

## COG's

## db's