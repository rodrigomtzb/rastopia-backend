//const { gql } = require("apollo-server-express");
 const { gql } = require("apollo-server");

const typeDefs = gql`
  type Client {
    id: ID
    name: String
    lastname: String
    email: String
    address: String
    phone: String
    created: String
    role: String
    discount: String
    creditCard: String
    acceptTerms: Boolean
  }
  type UploadedImage {
    public_id: String!
    version: String!
    width: Int!
    height: Int!
    format: String!
    created_at: String!
    resource_type: String!
    tags: [Tag]! 
    bytes: Int!
    type: String!
    etag: String!
    url: String!
    secure_url: String!
    signature: String!
    original_filename: String!
  }
  type Token {
    token: String
  }
  type SizeGroup {
    size: String
  }
  type Product {
    id: ID
    name: String
    model: String
    description: String
    category: String
    genre: String
    quantity: Int
    price: Float
    sizes: [SizeGroup]
    discount: Int
    photos: [photoProductGroup]
    created: String
  }
  type photoProductGroup {
    photo: String
  }
  type Order {
    id: ID
    order: [ItemOrder]
    total: Float
    client: Client
    status: StatusOrder
    delivery: String
    created: String
  }
 
  type ItemOrder {
    id: ID
    quantity: Int
    name: String
    price: Float
    size: String
    photos: [photoProductGroup]
  }
  input ClientInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }
  input AuthInput {
    email: String!
    password: String!
  }
  input ClientUpdateInput {
    name: String
    lastname: String
    email: String
    password: String
    address: String
    phone: String
    discount: String
    creditCard: String
  }

  input ProductInput {
    name: String!
    model: String!
    description: String
    category: Category!
    genre: Genre!
    quantity: Int!
    price: Float!
    sizes: [SizesAvailables]
    discount: Int
    photos: [photoGroup]
  }
  input photoGroup {
    photo: String
  }
  input SizesAvailables {
    size: String
  }

  enum Size {
    XS
    S
    M
    L
    XL
  }
  enum Genre {
    HOMBRE
    MUJER
    UNISEX
  }

  enum Category {
    Gorras
    Sombreros
    Playeras
    Blusas
    Camisas
    Chamarras
    Sueteres
    Pantalones
    Vestidos
    Faldas
  }

  input ProductUpdateInput {
    name: String
    model: String
    description: String
    category: Category
    genre: Genre
    quantity: Int
    price: Float
    sizes: [SizesAvailables]
    discount: Int
    photos: [photoGroup]
  }

  input OrderInput {
    order: [ItemOrderInput]
    client: ID
  }
  input OrderUpdateInput {
    status: StatusOrder
  }
  enum StatusOrder {
    PENDIENTE
    ENVIADO
    ENTREGADO
  }
  input ItemOrderInput {
    id: ID
    quantity: Int
    name: String
    price: Float
    size:String
     photos: [photoGroup]
  }
  input ProductFilterInput {
    category: Category
    genre: Genre
    sizes: [SizesAvailables]
    price: Float
    limit:Int
    skip:Int
  }
input UploadOptionsInput {
    public_id: String
    folder: String
    use_filename: Boolean
    unique_filename: Boolean
    resource_type: String
    type: String
    access_mode: String
    discard_original_filename: Boolean
    overwrite: Boolean
    tags: [TagInput]
    colors: Boolean
    faces: Boolean
    quality_analysis: Boolean
    cinemegraph_analysis: Boolean
    image_metadata: Boolean
    phash: Boolean
    auto_tagging: Boolean
    categorization: [CategoryInput]
  }
  input CategoryInput {
    name: String
  }
  input TagInput {
    tag_name: String!
  }
  type Tag {
    tag_name: String!
  }
  type Query {
    #client
    getClient(id: ID!): Client
    getAuth: Client
    #product
    getProducts: [Product]
    getProduct(id: ID!): Product
    getProductsFilter(input: ProductFilterInput): [Product]
    #order
    getOrders: [Order]
    getOrdersByClient(id: ID!): [Order]
    getOrder(id: ID!): Order

  }

  type Mutation {
    #client
    newClient(input: ClientInput): Client
    authUser(input: AuthInput): Token
    updateClient(id: ID!, input: ClientUpdateInput): Client

    #product
    newProduct(input: ProductInput): Product
    editProduct(id: ID!, input: ProductUpdateInput): Product
    deleteProduct(id: ID!): String

    #order
    newOrder(input: OrderInput): Order
    editOrder(id: ID!, input: OrderUpdateInput) : Order
    deleteOrder(id: ID!): String


    uploadImage(file: String! uploadOptions: UploadOptionsInput) : UploadedImage!
  }
`;

module.exports = typeDefs;
