# Elixir

Shell: `iex`

## data structures
```elixir

# linked list 
[3.14, :pie, "Apple"]

# tuples: contiguous memory
{3.14, :pie, "Apple"}

# keyword list
# keys are atoms
# keys are ordered
# keys aren't unique
[foo: "bar", hello: "world"]

# maps
# keys are anything
# keys are unique
%{:foo => "bar", "hello" => :world}
# if map has only atom-keys, there is a simpler syntax
%{foo: "bar", hello: "world"}
```

## enum
```elixir
Enum.all?(["foo", "bar", "baz"], fn(s) -> String.length(s) == 3 end)
```

## functions
```elixir
l = ["foo", "bar", "baz"]

# anonymous function
Enum.all? l, fn(s) -> String.length(s) == 3 end

# shorthand for the same (&(...) == "capture operator")
Enum.all? l, &( String.length(&1) == 3 )


# calling anonymous functions requires a `.`
sum = fn (a, b) -> a + b end
sum = &(&1 + &2)
sum.(2, 3)


# function pattern matching
handleResults = fn
    {:ok, result} -> IO.puts "Handling result"
    {:ok, _} -> IO.puts "This won't run as the previous case matches first"
    {:error} -> IO.puts "An error occured"
end


# named function
# always defined inside a module
defmodule Adding do 

    def plus_three(number) do
        number + 3
    end

    def plus_four(number), do: number + 4     #  `, do:` single line shorthand

    defp plus_five(number), do: number + 5    # private member

    def divide(a, b) when b != 0 do
        a / b
    end
end

Enum.map [1, 2, 3], &(Adding.plus_three &1)
```


## pattern matching

```elixir
x = 4
{x, y} = {1, 2}
# now x is re-bound to 1

# pin-operator ^ prevents re-binding
{^x, y} = {2, 3}
# throws error

```

## behaviors and protocols
```elixir
defprotocol Printable do
    def to_csv(data)
end

defimpl Printable, for: Map do
    def to_csv(map) do
        Map.keys(map)
            |> Enum.map(fn key -> map[key] end)
            |> Enum.join(",")
    end
end

m = %{foo: "bar", baz: "ball"}
Printable.to_csv(m)
```


# Processes

```elixir
# spawning

pid = spawn(fn -> 1 + 2 end)
Process.alive? pid


# sending and receiving

send(self(), {:hello, "world"})

receive do
    {:hello, msg} -> IO.puts msg
    {:world, _} -> "Won't match"
end


# if you want to crash the parent process when the child fails, use `spawn_link`

# Register a process so it can be accessed under some other handle than it's id
Process.register(pid, :myProcess)
send(:myProcess, %{some: "message"})
```

# Tasks
Like processes, but many convenience functions and better error reporting.


# State

We're using a process as a key-value state store.

```elixir
defmodule KV do

    def start_link do
        Task.start_link(fn -> loop %{} end)
    end

    def loop(map) do
        receive do
            {:get, key, caller} -> 
                    value = Map.get(map, key)
                    send caller, value
                    loop map
            {:put, key, value} -> 
                    loop Map.put(map, key, value)
        end
    end

end
```
Actually, there is already an existing abstraction for exactly this purpose for us: an `Agent`.
Another abstraction would be a `GenServer`.
