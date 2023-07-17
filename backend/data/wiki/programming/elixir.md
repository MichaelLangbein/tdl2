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

### Closures
```elixir
# closures exist (add knows about value)
# but cannot mutate outside state (return value always the same)
# nor will they be updated when closed-in variables are changed from outside
value = 1
add = fn (something) ->
  value = value + something
  IO.puts value
end
add.(2)   # -> 3
add.(2)   # -> 3
value = value + 4
add.(2)   # -> 3
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

## Protocols
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

## Behaviours
```elixir

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



# Abstractions
Consider this basic app:
```elixir
defmodule Store do

  def init() do
    # Module, :funcName, [list or args]
    spawn(Store, :loop, [%{}])
  end

  def loop(state) do
    receive do
      {senderPid, :set, key, value} ->
        state = Map.put(state, key, value)
        send(senderPid, {:setResult, :ok})
        loop(state)
      {senderPid, :get, key} ->
        {:ok, value} = Map.fetch(state, key)
        send(senderPid, {:getResult, value})
        loop(state)
      end
  end


end


storePid = Store.init()
send(storePid, {self(), :set, :firstEntry, "Hi there!"})
send(storePid, {self(), :set, :secondtEntry, "How are you?"})
send(storePid, {self(), :get, :firstEntry})

rec = fn() ->
  receive do
    {:setResult, value} ->
      IO.puts value
    {:getResult, value} ->
      IO.puts value
  end
end

rec.()
rec.()
rec.()
```


## GenServer
The basic task can be re-written simpler with [GenServer](https://github.com/elixir-lang/elixir/blob/main/lib/elixir/lib/gen_server.ex): 
```elixir
defmodule Store do
  use GenServer

  def init(state) do
    {:ok, state}
  end

  def handle_call({:set, key, value}, _from, state) do
    newState = Map.put(state, key, value)
    {:reply, :ok, newState}
  end

  def handle_call({:get, key}, _from, state) do
    {:ok, value} = Map.fetch(state, key)
    {:reply, value, state}
  end

end


{:ok, pid} = GenServer.start(Store, %{})                             # will call Store.init
IO.puts GenServer.call(pid, {:set, :firstEntry, "Hi there!"})        # will call Store.handle_call
IO.puts GenServer.call(pid, {:set, :secondEntry, "How are you?"})    # will call Store.handle_call
IO.puts GenServer.call(pid, {:get, :firstEntry})                     # will call Store.handle_call
```
GenServer additionally has `cast` and `handle_cast`, which is like `call` but asynchronous.



## Agent
The basic task can be re-written simpler with Agent.
Agent is implemented [on top of GenServer](https://github.com/elixir-lang/elixir/blob/v1.9.1/lib/elixir/lib/agent.ex).
```elixir
defmodule Store do
  use Agent

  def init(state) do
    Agent.start(fn () -> state end, name: __MODULE__)
  end

  def set(key, value) do
    Agent.update(__MODULE__, fn(state) -> Map.put(state, key, value) end)
  end

  def get(key) do
    Agent.get(__MODULE__, fn(state) -> Map.fetch(state, key) |> elem(1) end)
  end
end


Store.init(%{})                                     # Store is now a singleton
IO.puts Store.set(:firstEntry, "Hi there!")         # 
IO.puts Store.set(:secondEntry, "How are you?")
IO.puts Store.get(:firstEntry)
```



# RIESGOS

- use `Stream` to notify parent when new data comes in?