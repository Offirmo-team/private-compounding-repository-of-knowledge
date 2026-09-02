For personal usage but also for learning/practice purpose

THERE ARE TONS OF POSSIBLE APIs FOR GRAPHS

HENCE THIS LIB STARTS WITH ACTUAL USE CASES:

- file tree
- craft recipe
- todo list with dependencies

## Concepts

- Abstract Data Types https://en.wikipedia.org/wiki/Abstract_data_type

- https://en.wikipedia.org/wiki/Data_structure

- https://builtin.com/data-science/data-structures

1. Linear data structures
   - array
   - linked list
   - stack
   - queue
1. Non-linear data structures
   - Graph
     - directed graphs, weighted graphs, cyclic/acyclic...
     - Tree "hierarchical" data structures
       - binary trees, binary search trees, red-black trees, weight-balanced trees and binary heaps...
1. Hash tables

## Pragmatism

- UID = dual
  - internal, efficient UID used internally
  - external, user-provided UID
- upsert vs insert
- immutability?
  - it's hard to code properly
- made to be serializable
- flat = the tree is flattened into an array at the top

## Learning

Common operations https://en.wikipedia.org/wiki/Tree_(data_structure)

- Enumerating all the items
- Enumerating a section of a tree
- Searching for an item
- Adding a new item at a certain position on the tree
- Deleting an item
- Pruning: Removing a whole section of a tree
- Grafting: Adding a whole section to a tree
- Finding the root for any node
- Finding the lowest common ancestor of two nodes

traversal

- depth first
- breadth first
- in-order
- post-order
- level-order
