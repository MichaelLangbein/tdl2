# Ruby

## Functions
Ruby has functions, procs, lambdas and blocks.
- Functions cannot be passed around as arguments
- Procs can.
  - Procs are also object-instances of the class Proc
- Lambdas are a special case of Proc.
  - Lambdas take the number of arguments more seriously than procs do.
- Blocks are intended of a very specific design pattern, the "one-off single-behavior argument":
  - not saved to a variable anywhere, just one-off
  - assumed to be passed as last argument to a yielding function
  - Unlike procs, blocks are not objects.

```ruby
# Ordinary function. Cannot be passed as a function argument.
def sayHiF(name)
    puts "hi there, " + name
end
sayHiF "Michael"


# Proc. Can be passed as a function argument.
sayHiP = proc do |name|
    puts "hi there, " + name
end
sayHiP.call "Andreas"



# Block. https://avdi.codes/why-does-ruby-have-blocks/ 
# A yielding function is assumed to have been given a block as its last parameter,
# even if that block is not explicitly mentioned in the parameter list.
# Intended as a short hand for the common case of passing one - and only one - function as a parameter.
def yieldingFunction(name)
    greeting = "hi there, " + name
    yield greeting
end
yieldingFunction "Eva" do |greeting|
    puts greeting
end

# Alternatively the block may be listed and called a little more explicitly.
def altYieldingFunction(name, &block)
    greeting = "hi there, " + name
    block.call greeting
end
altYieldingFunction "Chloe" do |greeting|
    puts greeting
end


# A proc can be turned into a block with `&`
yieldingFunction "Sabine" &sayHiP
```

## Objects and keys
```ruby



```


## Modules
In other languages known as mixins.
