$ErrorActionPreference = 'SilentlyContinue'

$result = @{}

# Inventory
$result.TotalFolders = (Get-ChildItem -Path "src" -Recurse -Directory).Count
$result.TotalFiles = (Get-ChildItem -Path "src" -Recurse -File).Count
$result.TotalPages = (Get-ChildItem -Path "src/app" -Recurse -Filter "page.tsx").Count
$result.TotalComponents = (Get-ChildItem -Path "src/components", "src/features" -Recurse -Filter "*.tsx").Count
$result.TotalHooks = (Get-ChildItem -Path "src/hooks", "src/features/*/hooks" -Recurse -Filter "*.ts").Count
$result.TotalServices = (Get-ChildItem -Path "src/services" -Recurse -Filter "*.ts").Count
$result.TotalActions = (Get-ChildItem -Path "src/actions", "src/features/*/actions" -Recurse -Filter "*.ts").Count
$result.TotalTests = (Get-ChildItem -Path "src" -Recurse -Filter "*.test.*").Count

# Prisma Models
if (Test-Path "prisma/schema.prisma") {
    $schema = Get-Content "prisma/schema.prisma"
    $result.PrismaModels = ($schema | Select-String -Pattern "^model ").Count
} else {
    $result.PrismaModels = 0
}

# Routes verification
$routes = @("/", "/products", "/products/[id]", "/categories", "/categories/[slug]", "/search", "/cart", "/checkout", "/wishlist", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/account", "/account/orders", "/offers", "/inspiration")
$routeData = @()
foreach ($r in $routes) {
    $path = "src/app" + $r.Replace("[id]", "[id]").Replace("[slug]", "[slug]")
    $rInfo = @{
        Route = $r
        Page = (Test-Path "$path/page.tsx")
        Layout = (Test-Path "$path/layout.tsx")
        Loading = (Test-Path "$path/loading.tsx")
        Error = (Test-Path "$path/error.tsx")
    }
    $routeData += $rInfo
}
$result.Routes = $routeData

# Components verification
$comps = @("Header", "Footer", "ProductCard", "ProductGrid", "CategoryCard", "CartItem", "CheckoutForm", "OrderSummary", "LoginForm", "RegisterForm", "WishlistButton")
$compData = @()
foreach ($c in $comps) {
    $found = (Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | Select-String -Pattern "export function $c|export const $c|class $c").Count
    $used = (Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | Select-String -Pattern "<$c").Count
    $compData += @{ Component = $c; Exists = ($found -gt 0); UsedCount = $used }
}
$result.Components = $compData

# Services verification
$servs = @("ProductService", "CategoryService", "CartService", "CheckoutService", "OrderService", "ReviewService", "AuthService")
$servData = @()
foreach ($s in $servs) {
    $found = (Get-ChildItem -Path "src/services" -Recurse -Filter "*.ts" | Select-String -Pattern "export const $s|class $s").Count
    $used = (Get-ChildItem -Path "src" -Recurse -Filter "*.ts*" | Select-String -Pattern "$s\.").Count
    $servData += @{ Service = $s; Exists = ($found -gt 0); UsedCount = $used }
}
$result.Services = $servData

# Repo scan
$keywords = @("TODO", "FIXME", "console.log", "console.error", "debugger", "eslint-disable", "@ts-ignore", "any", "mock", "fake", "dummy", "placeholder", "sample")
$scanData = @()
foreach ($k in $keywords) {
    $hits = (Get-ChildItem -Path "src" -Recurse -File -Include *.ts,*.tsx | Select-String -Pattern $k -SimpleMatch).Count
    $scanData += @{ Keyword = $k; Hits = $hits }
}
$result.Scan = $scanData

$result | ConvertTo-Json -Depth 5 | Out-File -FilePath "audit_results.json"
