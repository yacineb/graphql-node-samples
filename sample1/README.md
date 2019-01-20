Queries examples:

Get all of available types in GraphQL type system with full description:

query {
  __schema {
    types {
      name,
      kind,
      description
    }
  }
}

Get users list:

query {
  users {
    id
    name
  }
}

Create a post

mutation {
  createPost(
     user_id:456, 
    title:"Hello"
  ) {
    id
  }
}

Remove a post

mutation {
  removePost(
     id:"959a53ae-1ca8-11e9-ab14-d663bd873d93"
  )
}



