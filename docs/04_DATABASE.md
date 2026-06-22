# Tashtep - Enterprise Database Architecture

## 1. Technical Stack
- **Database Engine**: MySQL
- **ORM**: Prisma
- **Paradigm**: Relational, Normalized (3NF) with strategic denormalization for read performance.

## 2. Global Naming Conventions
- **Tables**: PascalCase, singular (e.g., `User`, `Product`, `Order`).
- **Fields**: camelCase (e.g., `firstName`, `createdAt`).
- **Foreign Keys**: `[modelName]Id` (e.g., `userId`, `categoryId`).
- **Enums**: PascalCase, prefixed with enum type. Values in UPPER_SNAKE_CASE.

## 3. Entity Relationship Diagram (ERD) concept
- `User` (1) --- (M) `Order`
- `User` (1) --- (M) `Address`
- `Category` (1) --- (M) `Product`
- `Product` (1) --- (M) `ProductVariant`
- `Order` (1) --- (M) `OrderItem`
- `ProductVariant` (1) --- (M) `OrderItem`

## 4. Prisma Models (Draft Scheme)

### 4.1. Users & Profiles
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  phone         String?   @unique
  passwordHash  String?
  role          UserRole  @default(CUSTOMER)
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email, phone])
}

enum UserRole {
  CUSTOMER
  TRADE
  ADMIN
}

model Address {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  governorate String
  city        String
  street      String
  building    String
  floor       String?
  apartment   String?
  isDefault   Boolean  @default(false)

  @@index([userId])
}
```

### 4.2. Catalog
```prisma
model Category {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String     // Arabic Name
  description String?    @db.Text
  image       String?
  parentId    String?
  parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children    Category[] @relation("SubCategories")
  products    Product[]
  
  @@index([parentId])
}

model Product {
  id          String           @id @default(cuid())
  slug        String           @unique
  name        String           // Arabic Name
  description String           @db.Text
  features    Json?            // Array of feature highlights
  specs       Json?            // Key-value technical specs
  categoryId  String
  category    Category         @relation(fields: [categoryId], references: [id])
  variants    ProductVariant[]
  images      ProductImage[]
  isPublished Boolean          @default(false)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@index([categoryId])
}

model ProductVariant {
  id          String      @id @default(cuid())
  productId   String
  product     Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku         String      @unique
  name        String?     // e.g., "5 Liters", "Matte"
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  attributes  Json?       // {"color": "#FFFFFF", "size": "5L"}
  orderItems  OrderItem[]

  @@index([productId])
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  url         String
  alt         String?
  position    Int      @default(0)

  @@index([productId])
}
```

### 4.3. Orders & Checkout
```prisma
model Order {
  id             String      @id @default(cuid())
  userId         String
  user           User        @relation(fields: [userId], references: [id])
  status         OrderStatus @default(PENDING)
  totalAmount    Decimal     @db.Decimal(10, 2)
  shippingFee    Decimal     @db.Decimal(10, 2)
  paymentMethod  String      @default("COD")
  shippingAddress Json       // Snapshot of address at time of order
  items          OrderItem[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id               String         @id @default(cuid())
  orderId          String
  order            Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId        String
  variant          ProductVariant @relation(fields: [variantId], references: [id])
  quantity         Int
  unitPrice        Decimal        @db.Decimal(10, 2) // Captured price at checkout
  totalPrice       Decimal        @db.Decimal(10, 2)

  @@index([orderId])
  @@index([variantId])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}
```

## 5. Indexing Strategy
- Explicitly defined table indexes `@@index` on relational foreign keys to prevent full-table scans during massive joins.
- Strict unique indices on slugs `@@unique` for highly concurrent URL routing querying.
