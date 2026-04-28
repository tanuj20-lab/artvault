$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = $PSScriptRoot
$shotsDir = Join-Path $outDir "screenshots"
$docxPath = Join-Path $outDir "ArtVault_Project_Report.docx"
$pdfPath = Join-Path $outDir "ArtVault_Project_Report.pdf"

if (Test-Path $docxPath) { Remove-Item -LiteralPath $docxPath -Force }
if (Test-Path $pdfPath) { Remove-Item -LiteralPath $pdfPath -Force }

$wdFormatXMLDocument = 12
$wdExportFormatPDF = 17
$wdPageBreak = 7
$wdSectionBreakNextPage = 2
$wdAlignLeft = 0
$wdAlignCenter = 1
$wdAlignJustify = 3
$wdCollapseEnd = 0

function Add-Para {
  param(
    [object]$Doc,
    [string]$Text = "",
    [string]$Style = "Normal",
    [int]$Size = 12,
    [bool]$Bold = $false,
    [int]$Align = 0,
    [double]$SpaceAfter = 8,
    [double]$LineSpacing = 1.15
  )
  $p = $Doc.Paragraphs.Add()
  $p.Range.Text = $Text
  $p.Range.Style = $Style
  $p.Range.Font.Name = "Times New Roman"
  $p.Range.Font.Size = $Size
  $p.Range.Font.Bold = [int]$Bold
  $p.Alignment = $Align
  $p.SpaceAfter = $SpaceAfter
  $p.LineSpacingRule = 0
  $p.Range.InsertParagraphAfter()
  return $p
}

function Add-Heading {
  param([object]$Doc, [string]$Text, [int]$Level = 1)
  $size = if ($Level -eq 1) { 16 } elseif ($Level -eq 2) { 14 } else { 12 }
  $style = "Heading $Level"
  $p = Add-Para -Doc $Doc -Text $Text -Style $style -Size $size -Bold $true -Align $wdAlignLeft -SpaceAfter 10
  $p.Range.Font.Name = "Times New Roman"
}

function Add-Body {
  param([object]$Doc, [string]$Text)
  Add-Para -Doc $Doc -Text $Text -Style "Normal" -Size 12 -Bold $false -Align $wdAlignJustify -SpaceAfter 8 | Out-Null
}

function Add-Bullets {
  param([object]$Doc, [string[]]$Items)
  foreach ($item in $Items) {
    $p = Add-Para -Doc $Doc -Text $item -Style "Normal" -Size 12 -Align $wdAlignJustify -SpaceAfter 4
    $p.Range.ListFormat.ApplyBulletDefault()
  }
  $Doc.Paragraphs.Add().Range.InsertParagraphAfter()
}

function Add-PageBreak {
  param([object]$Doc)
  $range = $Doc.Range()
  $range.Collapse($wdCollapseEnd)
  $range.InsertBreak($wdPageBreak)
}

function Add-Screenshot {
  param([object]$Doc, [string]$ImageName, [string]$Caption)
  $imagePath = Join-Path $shotsDir $ImageName
  if (Test-Path $imagePath) {
    $p = Add-Para -Doc $Doc -Text $Caption -Style "Normal" -Size 11 -Bold $true -Align $wdAlignCenter -SpaceAfter 6
    $range = $Doc.Range()
    $range.Collapse($wdCollapseEnd)
    $shape = $Doc.InlineShapes.AddPicture($imagePath, $false, $true, $range)
    $shape.LockAspectRatio = $true
    if ($shape.Width -gt 470) { $shape.Width = 470 }
    Add-Para -Doc $Doc -Text "" -SpaceAfter 8 | Out-Null
  }
}

function Add-InfoTable {
  param([object]$Doc, [string[]]$Rows)
  $range = $Doc.Range()
  $range.Collapse($wdCollapseEnd)
  $table = $Doc.Tables.Add($range, $Rows.Count, 2)
  $table.Borders.Enable = $true
  $table.Range.Font.Name = "Times New Roman"
  $table.Range.Font.Size = 11
  for ($i = 0; $i -lt $Rows.Count; $i++) {
    $parts = $Rows[$i].Split("|", 2)
    $table.Cell($i + 1, 1).Range.Text = $parts[0]
    $table.Cell($i + 1, 2).Range.Text = $parts[1]
    $table.Cell($i + 1, 1).Range.Font.Bold = 1
  }
  $Doc.Paragraphs.Add().Range.InsertParagraphAfter()
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

$doc.PageSetup.TopMargin = 72
$doc.PageSetup.BottomMargin = 72
$doc.PageSetup.LeftMargin = 90
$doc.PageSetup.RightMargin = 72

$doc.Styles.Item("Normal").Font.Name = "Times New Roman"
$doc.Styles.Item("Normal").Font.Size = 12

# Cover page
Add-Para -Doc $doc -Text "A PROJECT REPORT" -Size 18 -Bold $true -Align $wdAlignCenter -SpaceAfter 16 | Out-Null
Add-Para -Doc $doc -Text "ON" -Size 14 -Bold $true -Align $wdAlignCenter -SpaceAfter 12 | Out-Null
Add-Para -Doc $doc -Text "ARTVAULT" -Size 24 -Bold $true -Align $wdAlignCenter -SpaceAfter 6 | Out-Null
Add-Para -Doc $doc -Text "ONLINE ART GALLERY & AUCTION PLATFORM" -Size 18 -Bold $true -Align $wdAlignCenter -SpaceAfter 24 | Out-Null
Add-Para -Doc $doc -Text "Submitted in partial fulfillment of the requirements for the award of degree/course completion" -Size 12 -Align $wdAlignCenter -SpaceAfter 24 | Out-Null
Add-Para -Doc $doc -Text "Submitted By" -Size 14 -Bold $true -Align $wdAlignCenter -SpaceAfter 8 | Out-Null
Add-Para -Doc $doc -Text "[Student Name]" -Size 13 -Bold $true -Align $wdAlignCenter -SpaceAfter 4 | Out-Null
Add-Para -Doc $doc -Text "[Roll Number / Enrollment Number]" -Size 12 -Align $wdAlignCenter -SpaceAfter 24 | Out-Null
Add-Para -Doc $doc -Text "Under the Guidance of" -Size 14 -Bold $true -Align $wdAlignCenter -SpaceAfter 8 | Out-Null
Add-Para -Doc $doc -Text "[Guide / Faculty Name]" -Size 12 -Align $wdAlignCenter -SpaceAfter 32 | Out-Null
Add-Para -Doc $doc -Text "[Department Name]" -Size 12 -Bold $true -Align $wdAlignCenter -SpaceAfter 4 | Out-Null
Add-Para -Doc $doc -Text "[College / University Name]" -Size 12 -Bold $true -Align $wdAlignCenter -SpaceAfter 4 | Out-Null
Add-Para -Doc $doc -Text "Academic Year 2025-2026" -Size 12 -Bold $true -Align $wdAlignCenter -SpaceAfter 4 | Out-Null
Add-PageBreak $doc

Add-Heading $doc "CERTIFICATE" 1
Add-Body $doc "This is to certify that the project report entitled `"ArtVault - Online Art Gallery & Auction Platform`" has been prepared and submitted by [Student Name] in partial fulfillment of the requirements of the academic project work. The project has been developed using the MERN stack and demonstrates a complete web-based platform for artwork discovery, artist uploads, real-time auctions, bidding, mock payments, notifications, and administrative management."
Add-Body $doc "The work presented in this report is based on the project files, database models, frontend pages, backend APIs, and implementation available in the ArtVault source code."
Add-Para -Doc $doc -Text "`n`nSignature of Guide`n`n[Guide / Faculty Name]" -Size 12 -Align $wdAlignLeft -SpaceAfter 20 | Out-Null
Add-PageBreak $doc

Add-Heading $doc "DECLARATION" 1
Add-Body $doc "I hereby declare that this project report titled `"ArtVault - Online Art Gallery & Auction Platform`" is prepared from the implemented project work. The contents describe the design, development, modules, technologies, database structure, testing, and screenshots of the application. The report has been prepared for academic submission and all project-specific information has been adapted from the actual ArtVault project."
Add-Para -Doc $doc -Text "`nDate: ____________`nPlace: ____________`n`nSignature: ____________" -Size 12 -Align $wdAlignLeft | Out-Null
Add-PageBreak $doc

Add-Heading $doc "ACKNOWLEDGEMENT" 1
Add-Body $doc "I express my sincere gratitude to my guide, teachers, and institution for providing the opportunity and support to complete this project. Their guidance helped in understanding the software development process, full-stack architecture, frontend-backend integration, database design, and testing methodology."
Add-Body $doc "I also thank everyone who provided feedback during the development of ArtVault. The project helped strengthen practical knowledge of React, Node.js, Express, MongoDB, REST APIs, authentication, role-based authorization, file upload handling, and real-time communication using Socket.IO."
Add-PageBreak $doc

Add-Heading $doc "ABSTRACT" 1
Add-Body $doc "ArtVault is an Online Art Gallery & Auction Platform designed to connect artists, buyers, and administrators through a single digital marketplace. The platform allows artists to upload artwork, manage artwork details, create auctions, and track auction status. Buyers can browse artwork, participate in live auctions, place bids, manage orders, and view payment receipts. Administrators can monitor users, artworks, auctions, and platform statistics."
Add-Body $doc "The project is developed using the MERN stack. The frontend uses React with Vite, Redux Toolkit, React Router, Axios, and Socket.IO client. The backend uses Node.js, Express, MongoDB with Mongoose, JWT-based authentication, Multer for artwork uploads, and Socket.IO for real-time auction updates. The system includes role-based access control for Artist, Buyer, and Admin roles."
Add-Body $doc "The application demonstrates core concepts of modern full-stack development including REST API design, secure authentication, protected routes, reusable components, responsive UI design, database modeling, live bid updates, and structured dashboard workflows."
Add-PageBreak $doc

Add-Heading $doc "TABLE OF CONTENTS" 1
$tocRange = $doc.Range()
$tocRange.Collapse($wdCollapseEnd)
$doc.TablesOfContents.Add($tocRange, $true, 1, 3) | Out-Null
Add-PageBreak $doc

Add-Heading $doc "1. INTRODUCTION" 1
Add-Body $doc "The art market increasingly depends on digital platforms for visibility, sales, and audience engagement. Traditional galleries are limited by location, operating hours, and manual coordination between artists and buyers. ArtVault provides a digital solution where original artworks can be listed, discovered, auctioned, and purchased through an integrated web application."
Add-Body $doc "The platform supports artwork browsing, category and price-based filtering, detailed artwork pages, live auctions, bid tracking, mock payment flow, notifications, and separate dashboards for artists, buyers, and administrators. It is designed as a full-stack MERN application with a responsive dark art-gallery aesthetic."

Add-Heading $doc "1.1 Project Title" 2
Add-Body $doc "ArtVault - Online Art Gallery & Auction Platform"

Add-Heading $doc "1.2 Problem Statement" 2
Add-Body $doc "Artists need a simple way to display and sell their work online, while buyers need a trusted system to discover artwork and participate in transparent auctions. Manual auction handling can be slow, error-prone, and difficult to monitor. ArtVault solves this by providing a centralized platform with role-based workflows and real-time bid updates."

Add-Heading $doc "1.3 Objectives" 2
Add-Bullets $doc @(
  "To provide an online gallery where users can browse artworks by category, price, status, and search keyword.",
  "To allow artists to upload artwork and manage artwork and auction records.",
  "To support live auctions with current bid tracking and countdown timers.",
  "To allow buyers to place bids, view bid history, complete mock payments, and view receipts.",
  "To provide notifications for auction, bid, and payment events.",
  "To provide an admin dashboard for user, artwork, auction, and platform overview management."
)

Add-Heading $doc "2. SYSTEM ANALYSIS" 1
Add-Heading $doc "2.1 Existing System" 2
Add-Body $doc "In many traditional art sale workflows, artists display work through physical galleries, direct contacts, or static catalogues. Auction updates may be handled manually and buyers may not receive instant bid status information. Such systems can limit reach, reduce transparency, and require more coordination."
Add-Heading $doc "2.2 Proposed System" 2
Add-Body $doc "The proposed system is a web-based MERN application that digitizes artwork listing, auction participation, payment simulation, and user management. It provides a structured interface for three user roles: Artist, Buyer, and Admin. Artists upload and auction artwork, buyers browse and bid, and admins monitor the platform."
Add-Heading $doc "2.3 Advantages of Proposed System" 2
Add-Bullets $doc @(
  "Centralized artwork discovery and auction management.",
  "Role-based authentication and protected dashboards.",
  "Real-time bid updates through Socket.IO.",
  "Responsive frontend with reusable React components.",
  "Structured database models for users, artworks, auctions, bids, orders, and notifications.",
  "Mock payment flow that can later be integrated with Razorpay, Stripe, or another payment gateway."
)

Add-Heading $doc "3. REQUIREMENT SPECIFICATION" 1
Add-Heading $doc "3.1 Hardware Requirements" 2
Add-InfoTable $doc @(
  "Processor|Intel i3 / Ryzen 3 or higher",
  "RAM|4 GB minimum, 8 GB recommended",
  "Storage|500 MB for project files and dependencies",
  "Network|Internet connection for cloud image URLs and package installation"
)
Add-Heading $doc "3.2 Software Requirements" 2
Add-InfoTable $doc @(
  "Operating System|Windows / Linux / macOS",
  "Frontend Runtime|Node.js 18+ with Vite",
  "Backend Runtime|Node.js with Express",
  "Database|MongoDB local or MongoDB Atlas",
  "Editor|Visual Studio Code",
  "Browser|Microsoft Edge / Chrome / Firefox"
)
Add-Heading $doc "3.3 Technology Stack" 2
Add-Bullets $doc @(
  "Frontend: React 19, Vite, Redux Toolkit, React Router, Axios, React Hot Toast, Socket.IO Client.",
  "Backend: Node.js, Express, CORS, dotenv, JWT, bcryptjs, Multer, Socket.IO.",
  "Database: MongoDB with Mongoose schemas.",
  "Development Tools: ESLint, Nodemon, npm scripts, Git."
)

Add-Heading $doc "4. SYSTEM DESIGN" 1
Add-Heading $doc "4.1 Architecture" 2
Add-Body $doc "ArtVault follows a client-server architecture. The React frontend communicates with the Express backend through REST APIs. MongoDB stores persistent records, while Socket.IO enables live auction bid events. Authentication uses JWT tokens stored on the client and sent through authorization headers for protected requests."
Add-Heading $doc "4.2 Data Flow" 2
Add-Bullets $doc @(
  "A user registers or logs in through the authentication API.",
  "The backend validates credentials, generates a JWT token, and returns user role information.",
  "The frontend stores the user session and controls route access through protected routes.",
  "Artists upload artwork and create auctions through protected API endpoints.",
  "Buyers browse public artwork and auction data and place bids through authenticated bid APIs.",
  "Socket.IO broadcasts new bid updates to users viewing the same auction.",
  "Orders and notifications are generated for payment and auction-related events."
)

Add-Heading $doc "4.3 Database Design" 2
Add-Body $doc "The system uses six main MongoDB models:"
Add-Bullets $doc @(
  "User: stores name, email, hashed password, role, avatar, bio, and active status.",
  "Artwork: stores artist reference, title, description, category, medium, dimensions, base price, image URL, tags, featured flag, and status.",
  "Auction: stores artwork reference, artist reference, starting bid, current highest bid, highest bidder, end date, status, and winner.",
  "Bid: stores auction reference, buyer reference, bid amount, and bid timestamp.",
  "Order: stores buyer, artwork, auction, amount, payment status, delivery status, transaction details, and shipping address.",
  "Notification: stores receiver, type, message, read status, and related event information."
)

Add-Heading $doc "5. MODULE DESCRIPTION" 1
Add-Heading $doc "5.1 Authentication Module" 2
Add-Body $doc "The authentication module includes registration, login, current user retrieval, and profile update features. Passwords are hashed with bcryptjs, and JWT is used to authenticate protected requests. Role-based protected routes separate Artist, Buyer, and Admin workflows."
Add-Heading $doc "5.2 Gallery Module" 2
Add-Body $doc "The gallery module displays artworks with filters for category, status, sort order, search text, and price range. Each artwork card links to a detailed page showing title, artist, category, description, price, status, and auction information when applicable."
Add-Heading $doc "5.3 Artwork Upload Module" 2
Add-Body $doc "Artists can upload artwork with title, description, category, medium, dimensions, base price, tags, and artwork image. The backend uses Multer to handle file upload and stores artwork metadata in MongoDB."
Add-Heading $doc "5.4 Auction Module" 2
Add-Body $doc "Artists can create auctions for available artworks. Buyers can view active auctions, inspect details, track countdown timers, view current highest bids, and place bids. Socket.IO updates auction pages when new bids are placed."
Add-Heading $doc "5.5 Order and Payment Module" 2
Add-Body $doc "The order module supports mock payment after a buyer wins or purchases artwork. Paid orders include transaction information and receipt display. This module is designed so a real payment provider can be integrated later."
Add-Heading $doc "5.6 Notification Module" 2
Add-Body $doc "Notifications inform users about bids, auction wins, payment events, and other general updates. Users can mark notifications as read or mark all notifications as read."
Add-Heading $doc "5.7 Admin Module" 2
Add-Body $doc "The admin dashboard provides platform statistics and management views for users, artworks, and auctions. Admin users can monitor the system and toggle or delete user accounts where required."

Add-Heading $doc "6. IMPLEMENTATION DETAILS" 1
Add-Heading $doc "6.1 Frontend Implementation" 2
Add-Body $doc "The frontend is organized into pages, components, Redux slices, and API services. React Router manages navigation. Redux Toolkit stores authentication, artworks, auctions, bids, orders, and notifications. Axios centralizes API calls and attaches JWT tokens to protected requests."
Add-Heading $doc "6.2 Backend Implementation" 2
Add-Body $doc "The backend is structured into routes, controllers, middleware, models, config, and utilities. Express handles API routing. Mongoose manages database schemas. Auth middleware protects routes by verifying JWT tokens. Role middleware restricts access to Artist, Buyer, and Admin operations."
Add-Heading $doc "6.3 API Endpoints" 2
Add-InfoTable $doc @(
  "Authentication|/api/auth/register, /api/auth/login, /api/auth/me, /api/auth/profile",
  "Artworks|/api/artworks, /api/artworks/my, /api/artworks/:id",
  "Auctions|/api/auctions, /api/auctions/my, /api/auctions/:id, /api/auctions/:id/end",
  "Bids|/api/bids, /api/bids/auction/:auctionId, /api/bids/my",
  "Orders|/api/orders, /api/orders/my, /api/orders/:id, /api/orders/:id/pay",
  "Notifications|/api/notifications, /api/notifications/:id/read, /api/notifications/read-all",
  "Admin|/api/admin/stats, /api/admin/users, /api/admin/artworks"
)

Add-Heading $doc "7. USER INTERFACE SCREENSHOTS" 1
Add-Body $doc "The following screenshots were captured from the running local ArtVault application at http://localhost:5173."
Add-Screenshot $doc "01_home.png" "Figure 7.1: Home Page"
Add-Screenshot $doc "02_gallery.png" "Figure 7.2: Artwork Gallery"
Add-Screenshot $doc "03_auctions.png" "Figure 7.3: Auction Listing"
Add-Screenshot $doc "04_artwork_details.png" "Figure 7.4: Artwork Details Page"
Add-Screenshot $doc "05_auction_detail.png" "Figure 7.5: Auction Detail and Bid Panel"
Add-Screenshot $doc "06_login.png" "Figure 7.6: Login Page"
Add-Screenshot $doc "07_register.png" "Figure 7.7: Registration Page"
Add-Screenshot $doc "08_upload_redirect.png" "Figure 7.8: Protected Artist Upload Route"
Add-Screenshot $doc "09_notifications_redirect.png" "Figure 7.9: Protected Notifications Route"

Add-Heading $doc "8. TESTING" 1
Add-Heading $doc "8.1 Testing Approach" 2
Add-Body $doc "Testing was performed by validating user flows, protected route behavior, API responses, data display, and frontend build quality. Public pages were checked in the browser and backend health was verified through the health API."
Add-Heading $doc "8.2 Test Cases" 2
Add-InfoTable $doc @(
  "Register User|Verify buyer or artist account creation with required fields.",
  "Login User|Verify valid users receive token and dashboard access.",
  "Browse Gallery|Verify artworks load and filters update results.",
  "View Artwork Details|Verify artwork information, artist, price, status, and image display.",
  "View Auctions|Verify active auctions and bid values are visible.",
  "Place Bid|Verify buyer can submit a bid higher than current highest bid.",
  "Protected Routes|Verify unauthenticated users are redirected to login.",
  "Admin Dashboard|Verify platform statistics and management tables load for admin role.",
  "Build and Lint|Verify frontend checks pass without lint errors."
)
Add-Heading $doc "8.3 Validation Result" 2
Add-Bullets $doc @(
  "Frontend local server responded successfully at http://localhost:5173.",
  "Backend health endpoint responded successfully at http://localhost:5000/api/health.",
  "Artwork API returned populated artwork records.",
  "Auction API returned active auction records with artwork and bidder data.",
  "Screenshots were captured from the live local application."
)

Add-Heading $doc "9. FUTURE SCOPE" 1
Add-Bullets $doc @(
  "Integrate a real payment gateway such as Razorpay or Stripe.",
  "Add advanced auction rules such as bid increments, reserve price, and auto-extension.",
  "Add email notifications for bid updates and payment confirmations.",
  "Add artist verification and artwork approval workflow.",
  "Add order shipment tracking and delivery partner integration.",
  "Add analytics reports for artists and administrators.",
  "Improve image storage using cloud services such as Cloudinary or AWS S3."
)

Add-Heading $doc "10. CONCLUSION" 1
Add-Body $doc "ArtVault successfully demonstrates a full-stack online art gallery and auction platform. The project combines a responsive React frontend, Express backend, MongoDB database, JWT authentication, role-based access, real-time auction updates, mock payment flow, and dashboards for different users. It provides a practical solution for artists and buyers and can be extended into a production-ready marketplace with payment, verification, and deployment enhancements."

Add-Heading $doc "11. REFERENCES" 1
Add-Bullets $doc @(
  "React Documentation - https://react.dev/",
  "Vite Documentation - https://vite.dev/",
  "Express Documentation - https://expressjs.com/",
  "MongoDB Documentation - https://www.mongodb.com/docs/",
  "Mongoose Documentation - https://mongoosejs.com/",
  "Socket.IO Documentation - https://socket.io/docs/",
  "Redux Toolkit Documentation - https://redux-toolkit.js.org/"
)

$doc.TablesOfContents.Item(1).Update()
$doc.SaveAs2($docxPath, $wdFormatXMLDocument)
$doc.ExportAsFixedFormat($pdfPath, $wdExportFormatPDF)
$doc.Close($false)
$word.Quit()

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null

Write-Host "Generated:"
Write-Host $docxPath
Write-Host $pdfPath
