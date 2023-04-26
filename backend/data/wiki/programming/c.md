# C

# General theory

## Memory allocation
By default, memory is allocated statically to the stack. By using ` malloc} and \inlinecode{free `, you can instead allocate memory dynamically on the heap.

## Threading
Threads are created by making a copy of the orignal process.
Threads share the same memory with their parents.



|               | Sub-Process                                                              | Thread                                                    |
|---------------|--------------------------------------------------------------------------|-----------------------------------------------------------|
| Creation      | Copy of mother process                                                   |                                                           |
| Memory        | Own memory                                                               | Shared memory                                             |
| Communication | Communicates with mother through syscalls, pipes and files               | Can directly call methods of mother process               |
| Usecase       | Ideal if mother and subprocesses must be separated for security reasons, | Ideal if thread output to be processed by mother process, |
|               | like apache-server does                                                  | because no piping neccessary                              |



```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
 
// A normal C function that is executed as a thread 
// when its name is specified in pthread_create()
void *myThreadFun(void *vargp) {
    sleep(1);
    printf("Printing GeeksQuiz from Thread \n");
    return NULL;
}
  
int main() {
    pthread_t tid;
    printf("Before Thread\n");
    pthread_create(&tid, NULL, myThreadFun, NULL);
    pthread_join(tid, NULL);
    printf("After Thread\n");
    exit(0);
}
```

As mentioned above, all threads share data segment. Global and static variables are stored in data segment. Therefore, they are shared by all threads. The following example program demonstrates the same.

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
 
// Let us create a global variable to change it in threads
int g = 0;
 
// The function to be executed by all threads
void *myThreadFun(void *vargp) {
    // Store the value argument passed to this thread
    int *myid = (int *)vargp;
 
    // Let us create a static variable to observe its changes
    static int s = 0;
 
    // Change static and global variables
    ++s; ++g;
 
    // Print the argument, static and global variables
    printf("Thread ID: %d, Static: %d, Global: %d\n", *myid, ++s, ++g);
}
 
int main() {
    int i;
    pthread_t tid;
 
    // Let us create three threads
    for (i = 0; i < 3; i++)
        pthread_create(&tid, NULL, myThreadFun, (void *)i);
 
    pthread_exit(NULL);
    return 0;
}
```

```bash
gfg@ubuntu:~/$ gcc multithread.c -lpthread
gfg@ubuntu:~/$ ./a.out
Thread ID: 1, Static: 1, Global: 1
Thread ID: 0, Static: 2, Global: 2
Thread ID: 2, Static: 3, Global: 3
gfg@ubuntu:~/$ 
```

Please note that above is simple example to show how threads work. Accessing a global variable in a thread is generally a bad idea. What if thread 2 has priority over thread 1 and thread 1 needs to change the variable. In practice, if it is required to access global variable by multiple threads, then they should be accessed using a mutex.

## Getting data from C to another programm


| Pipe                         | Socket                 |
|------------------------------|------------------------|
| Unidirectional               | Bidirectional          |
| Fifo                         |                        |
| Limited volume (~0.5 MB);    |                        |
| all in memory                | all in memory          |
| no protocol                  | packets (UDP or TCP)   |
|                              | can go over network    |


**Per file**
Simplest, but also slowest because it involves disk i/o.

**Per pipe or socket**
Faster than file-writing, because no disc i/o is involved. 
But still slow because data is chucked into packages that are wrapped in a rather verbose protocol.

**Per JNI**
This should allow you to convert C-datastructures to Java-datastructures.




# Quirks and features you need to know

## * syntax

```c
int a = 1; 
int * a_ptr = &a;
*a_ptr; // <--- yields 1
```

- When assigning, `*` means: "make it a pointer".
- When qerying, `*` means: "get the value behind the pointer".
- `&` always means: "get the address".



## Pointer arithmetic

Array indexing is actually a rather complex issue with a lot of syntactical sugar.

```c
int arr[3] = {10, 20, 30};
arr[2] = 15;
```


- $arr$ gets you the pointer to the first element in the array. In other words, we have $arr = \&arr[0]$
- $[2]$ adds to $arr$ the size of 2 ints. Thus we have $arr[2] = \&arr[0] + 2 * sizeof(int)$.
- Finally, the actal value behind the expression is adjusted when we assign the value of 15. Thus the expression reduces to 
        ```c
            *(&arr[0] + 2 * sizeof(int)) = 15;
        ```



We can use array indexing to our advantage: with *buffer overflow*s we can read arbitrary parts of the memory. 
Consider this simple example:

```c
   int main () {
        int arr[3] = {1, 2, 3};
        int i;
        for(i=0; i < 100; i++){
                printf("%d th entry: location: %p value: %d \n", i, &arr[i], arr[i]);
        }
        return 0;
} 
```

Especially when creating arrays, we need to be aware of a few things: 

- ... what is the current content of the accessed memory?
- ... is the accessed memory protected against overwriting by others?


```c
#include<stdio.h>
#include <stdlib.h>  

int main() {

  const int size = 1000;
  //double data[size] = {2.1,2.1,2.1, 2.1, 2.1};   //<-- puts in vals; fills rest with zeros. This mem won't be overwritten. 
  //double data[size];      //<-- does not put in zeros - keeps whatever was in there before. This mem won't be overwritten.
  //double* data = (double*) malloc(size * sizeof(double));              //<-- puts in zeros. This mem won't be overwritten.
  //double* data;      //<-- does not put in zeros - keeps whatever was in there before. This mem can be overwritten by others! 
  for(int i = 0; i < size; i++) {
    double val = data[i];
    printf("val at %i: %f \n", i, val);
  }

  return 0; 
}
```
When we state that *this mem won't be overwritten*, of course we exclude overwriting by buffer overflow. 

## Array decay: Functions can't accept arrays

Functions never accept arrays, they only take pointers to the first element. This is known as array-decay.

```c
int arr[3] = {1,2,3};
somefunct(arr); // <--- compiler turns this automatically into 
somefunct(&arr[0]);
```


## Array decay: Functions don't return arrays, either

Functions return single values just fine, but arrays only by pointer. 
$arrFunct$ must save array on heap and return pointer to the heap.
The calling function must know the arrays size in advance or be given a struct with metainfo about the size.
The calling function must also later deallocate the array.

```c
int * arrOnHeap(){
    int * arr_ptr = malloc( sizeof(int) * 3 );
    arr_ptr[0] = 10;
    arr_ptr[1] = 20;
    arr_ptr[2] = 30;
    return arr_ptr;
}

int * arr_ptr = arrOnHeap();
```


## Array syntax 
Java and c have some weird differences in array initialisation. Consider array litterals: 
```
int coeffs[5] = {1, 2, 3, 4, 5}; // c
int[] coeffs = {1, 2, 3, 4, 5};  // java
```
And also standard initialisation:
```
int coeffs[5];   // c
int[] coeffs = new int[5]; // java
```


## Struct syntax

There is a really important thing when creating struct-construction functions.
Consider the following code. 

```c
typedef struct Island {
	char* name;
	char* opens;
	char* closes;
	struct Island* next;
} Island;


Island* island_create(char* name){
	Island* i = malloc(sizeof(Island));
	i->name = name;
	i->opens = "09:00";
	i->closes = "17:00";
	i->next = NULL;
	return i;
}

int main(){
    char* name;
    fgets(name, 80, stdin);
    Island* island1 = island_create(name);
    fgets(name, 80, stdin);
    Island* island2 = island_create(name);
    
    return 0;
}
```

You will find that the name of island1 equals that of island2!
The reason is that their names are just a reference to char* name in the main method. 
We need a safety measure inside the constructor to allocate a copy of the input string so that we can sure a new call to the constructor does not give us the same pointer again.

This code fixes the problem: 

```c
Island* island_create(char* name){
    char* namec = strdup(name);
	Island* i = malloc(sizeof(Island));
	i->name = namec;
	i->opens = "09:00";
	i->closes = "17:00";
	i->next = NULL;
	return i;
}

void island_destroy(Island* i){
    free(i->name);
    free(i);
}
```



## Passing functions as variables

This is our entry to functional programming in c.
A functionname is really just a pointer to the memory location where the function code is stored. So we can use the function name as a pointer.

Of course, functions have different types. That's why we can't just write 
```c
function* f;
```

But instead must write:
```c
char* (*reverseName)(char*);
```
Here, the first char* is the return type, whereas the second is the argument(-list) to the function. Let's see an example:


```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


int num_ads = 7;
char* ads[] = {
	"William: SBM GSOH likes sports, TV, dining",
	"Matt: SWM NS likes art, movies, theater",
	"Luis: SLM ND likes books, theater, art",
	"Mike: DWM DS likes trucks, sports and bieber",
	"Peter: SAM likes chess, working out and art",
	"Josh: SJM likes sports, movies and theater",
	"Jed: DBM likes theater, books and dining"
};


int likes_sport_not_bieber(char* ad){
	int hit = (strstr(ad, "sports") && !strstr(ad, "bieber"));
	return hit;
}

int likes_sports_or_workout(char* ad){
	int hit = (strstr(ad, "sports") || strstr(ad, "workout"));
	return hit;
}


void find(int (*match_fn)(char*)){
	puts("Search results:");
	puts("----------------------");

	int i;
	for(i=0; i < num_ads; i++){
		if(match_fn(ads[i])){
			printf("%s\n", ads[i]);
		}
	}

	puts("---------------------");
}

int main(){

	find(likes_sport_not_bieber);
	find(likes_sports_or_workout);

	return 0;

}

```


We should note some syntactic sugar here. 
Calling functions is usually done like this:
```c
int a = somFunc(b);
```
But that's just shorthand for the actual code:
```c
int a = (*somFunc)(b);
```

Also, passing functions as arguments really compiles down to:
```c
find(&likes_sport_not_bieber);
```



## Strings end with a \0

Thats why, when declaring an empty string, leave space for the \0 .

```c
char word[3];
strcpy(word, "hi");
strlen(word); // <--- yields 2
sizeof(word); // <--- yields 3
```


## char[] does not equal char*

```c
char a[] = "hello";
char * b = "world";
```

$a$ is equal to: `H E L L O \0 `
$b$ is equal to a `pointer` pointing to `W O R L D \0`




## Header files

Header files are how we can expose only a subset of a file to main.c. Really they contain only the function signatures, not their implementation. In that way, c basically forces you to import *everything* as an interface. 


```c
#include <stdio.h>
#include "encrypt.h"

int main(){
    char msg[80];
    while(fgets(msg, 80, stdin)){
        encrypt(msg);
        printf("%s", msg);
    }
}
```

encrypt.h
```c
void encrypt(char * msg);
```

encrypt.c
```c
#include "encrypt.h"

void encrypt(char * msg) {
    char c;
    while(*msg){
        *msg = *msg ^ 31;
        msg++;
    }
}
```



## Building and Makefiles
The building of an executable consists of compiling and linking. 

- **Compiling your own code** The compiler generates an object file from your source-code. An object-file is a compiled piece of code together with some meta-information on what kind of functions and structures it contains. 
- **Linking in libraries** After that, the include-directories are scanned for libraries that contain implementations of the header-files you included in your source-code. This phase is called linking. There are two ways you can link in external libraries.

    - Static linking means that a copy of the library is added to the final executable at compile time. The executable can then be moved to another machine without worries, because all required libraries are placed inside the executable. Static libraries are usually written like this: `libXXX.a` and created with the `ar` program.
    -  Alternatively, libraries can be linked in a dynamic way: that means that the executable will search for an appropriate library once it needs to call its functions, that is, at run time.  Shared/dynamic libraries are written like ` libYYY.so` and created with `gcc -fPIC -c YYY.c && gcc -shared -o libYYY.so YYY.o`
    - Both ` .a` and `.so` libraries are included with the `-l` and `-L ` commands. 
    


Makefiles are how we knot together different parts of a c program. It's really easiest to look at a specific example:

```bash
# Includes are header files without a concrete implementation.
INCLUDES = -I/usr/include/mysql
# Libraries are object files. -L adds a directory of libraries, -l adds a single library. 
LIBS = -L/usr/lib/x86_64-linux-gnu -lmysqlclient -ljansson -pthread
WARNINGS = -Wall -Wextra

# Compiling
#   -c: compile (nur compile, nicht link!)
#   -g: fuer debugger

incl.o: incl.c incl.h
	gcc -g -c $(WARNINGS) $(INCLUDES) incl.c

jsn.o: jsn.c jsn.h incl.h
	gcc -g -c $(WARNINGS) $(INCLUDES) jsn.c

psql.o: psql.c jsn.h
	gcc -g -c $(WARNINGS) $(INCLUDES) psql.c

# Linking
# 	-o: object-file: name der fertigen binary
# 	-g: fuer debugger

psql: psql.o jsn.o incl.o
	gcc -g -o psql psql.o jsn.o incl.o $(LIBS)
	
clean: 
    rm *.o

all: psql clean
```
 
**Includes** sind header files.
Option `-I`(dirname): hinzufügen dir zu Suchpfad für *.h files.
Im Gegensatz zu libs kann man bei incls nur dirs spezifizieren, nicht einzelne files. Dafür gibt es ja schon die \#include Direktive.

**Libs** sind die den header files zu Grunde liegenden so files.
- Option `-L`(dirname): hinzufügen dir zu Suchpfad für *.so files.
- Option `-l`(libname): mit Einbinden einer lib.
- Option `-pthread`: eine besondere Option; steht für -lpthread + definiere ein paar extra macros

Jansson ist ein externes Programm. Es muss erst ge-make-t werden (oder ge apt-get-tet), danach finden wir header per default in /usr/local/include und libs in /usr/local/lib

## Valgrind
The $-g$ flags from the above makefile were actually meant for use in valgrind. 
Valgrind analyses your memory allocation. It does so by creating its own, fake versions of $malloc$ and $free$. Anytime these are called, valgrind does its bookkeeping to check if any allocated memory is left on the heap.

Analysing code with valgrind is easy. Just compile it and then run it like this:
```bash
make all
valgrind -v --leak-check=full --show-leak-kinds=all --log-file=val.log ./psql input.json
```

## OpenMP
OpenMP is a set of macros used for control-flow for threads. Think of automatically distributing your for-loop over threads.










# CMake and Autotools
While make does a good job at automating the build of c-programs, all the commands you type there are platform dependent. For that reason, larger projects use more sophisticated buildsystems. They don't require less configuration (in fact, they usually require *more* work) but they make it easier to create a build that will work on any platform. Usually they work by first scanning your environment and then creating makefiles for you. 

Working with these is not exactly pleasant. This section only contains a *how-to* handle existing open-source projects that you have to get to compile somehow. 

We begin with autotools. 

- ` ./configure `
- ` make `
- ` make install `
- Troubleshooting: most likely, some shared libraries will be missing. Find out which by calling `  `





# Best practice

The above quirks gave us a lot of points where we need to be careful in c. 
For that reason, we should adhere to some best practices to make coding as save as possible.

**Only expose top and lowest layer, not internals**
Datastructures in C tend to be actual data wrapped in structs wrapped in structs wrapped in structs. The highest level struct should only expose data, not any intermediate structs. This way, a user only needs to know the api for the highest level struct and the data itself. Also, every struct should manage its own and only its own memory.

**Handling unknown datatype elements**
Your datastructures will usually contain elements of a type unknown to you. That is not really a problem, because you can reference them using a `void*`. But how about creating and destroying those unknown elements? Well, here we can use c's functional programming skills: just add to the datastructure a function for creating and one for destroying the element.

**Never leave a pointer unassigned**
 You can create a pointer without having it point anywhere in particular: ` int* apt;`. 
 But what if later in your code you want to check if that pointer has been pointed to an `int` yet? `apt` is initially just going to point to some random location. This means that you cannot check `if(apt == NULL)`, because it's never going to be 0! For this reason, even if you don't want `apt` to point to anything yet, at least make sure it points to `NULL`. So always create pointers with `int* apt = NULL;`
 