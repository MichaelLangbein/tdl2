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


```

Shorthands:

```ruby
# A proc can be turned into a block with `&`
yieldingFunction "Sabine" &sayHiP

# A block can be shortened: replacing do/end with {}
ratings
  .reduce(0) {|carry, rating| carry + rating.stars}
  .div(ratings.count)
```

## Objects and keys

```ruby



```

## Modules

In other languages known as mixins.

## Classes

- You can call functions inside a class'es body, but outside of any of its functions.
  - example: `before_action`
  - https://stackoverflow.com/questions/1344797/ruby-method-calls-declared-in-class-body
  - if no source-object (`1.to_s`) or class (`ActiveRecord.save`) is given, that function must belong to either the containing class or one of its parents
  - Such in-class-body-functions are called once the class definition block is finished.
