# R

## Tooling

-   conda
-   jupyter

## Syntax

```R
# variables
# R is dynamically and strongly typed (so like Python, not like JS)

#-------------- Vectors ----------------------------------------------------

# Vectors should be of a single type only
myArray <- c(1, 2, 3)

# Named vectors are like dictionaries
# (though named lists are more common)
my_vector <- c("Alice" = 25, "Bob" = 30)
print(my_vector)

# Accessing elements
print(my_vector["Alice"])  # Output: 25


# mixed type vectors will convert to the most flexible type (usually char)
# so `myBadArray` will end up being stored as an array of chars
myBadArray <- c("some", "data", 12, 13)


#----------------------- Lists ------------------------------------------------

# Lists can have multiple types
myList <- list(42, "hi", TRUE, 3.12)

# Named lists are like dictionaries
my_dict <- list(name = "Alice", age = 25, occupation = "Data Scientist")
print(my_dict)

# Accessing elements
print(my_dict$name)  # Output: "Alice"
print(my_dict$age)   # Output: 25

# Create a named list
person <- list(name = "John", age = 28, city = "New York")

# Accessing values
print(person$name)  # Output: "John"
print(person["age"])  # Output: 28

# Adding a new element
person$occupation <- "Engineer"
print(person)

# Removing an element
person$city <- NULL
print(person)

# -------------------- Data frames ---------------------------------------------

# data frames
my_data_frame <- data.frame(
    Name = c("Alice", "Bob"),
    Age = c(25, 30),
    Score = c(90.5, 85.3)
)
print(my_data_frame)

# Output:
# Name Age Score
# 1 Alice 25 90.5
# 2 Bob 30 85.3

# ------------------------ functions ------------------------------------------

# Define the function with named parameters and a default value
my_function <- function(param1, param2 = "default value", param3) {
  # Combine the parameters into a string for demonstration
  result <- paste("Parameter 1:", param1, ", Parameter 2:", param2, ", Parameter 3:", param3)
  return(result)
}

# Call the function with and without specifying the default parameter
output1 <- my_function("Value1", "Specified value", "Value3")
print(output1)  # Output: "Parameter 1: Value1 , Parameter 2: Specified value , Parameter 3: Value3"

output2 <- my_function("Value1", param3 = "Value3")
print(output2)  # Output: "Parameter 1: Value1 , Parameter 2: default value , Parameter 3: Value3"




```
