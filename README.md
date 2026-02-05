
# HAInspector


[![CI/CD](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/ci-cd.yml)
[![Code Quality](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/lint.yml)
[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://hainspector.vercel.app)


A web-based tool for exploring Bluetooth Low Energy (BLE) devices and charger status using Web Bluetooth API and Web Serial API.

## 🌐 Live Demo


**Production:** [https://hainspector.vercel.app](https://hainspector.vercel.app)

## Features

### 🔋 Charger Management
- Auto-detect and connect to Widex charger (USB Serial)
- Real-time battery status monitoring for 2 slots
- Manufacturing info (firmware/hardware versions)
- Auto-reconnect on disconnect
- Retry logic for reliable data reading

### 📡 BLE Device Explorer
- Scan and connect to BLE devices
- Auto-connect GATT on device selection
- Complete GATT Services Explorer with:
  - Service discovery (Primary/Secondary)
  - Characteristic properties (Read/Write/Notify/Indicate/etc.)
  - Descriptor discovery and reading
  - Battery Service (0x180F) support
  - Device Information Service (0x180A) support
- Read, Write, Subscribe to characteristics
- Human-readable UUID formatting

### 🏥 Health Inspection
- Animated health check results
- Multi-category assessment
- Color-coded status indicators

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ recommended
- npm
- Modern browser with Web Bluetooth & Web Serial API support:
  - Chrome 89+
  - Edge 89+
  - Opera 76+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit `http://localhost:5173`

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
HAInspector/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   │   ├── ci-cd.yml       # Main deployment workflow
│   │   ├── lint.yml        # Code quality checks
│   │   └── dependency-review.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── main.js             # App orchestrator
│   ├── ble/
│   │   └── ble.js          # BLE device handling
│   ├── charger/
│   │   ├── ChargerController.js
│   │   ├── ChargerUnit.js
│   │   └── [other charger classes]
│   ├── serial/
│   │   └── serial.js       # Web Serial API
│   ├── ui/
│   │   └── ui.js           # UI updates
│   ├── log/
│   │   └── log.js          # Logging utilities
│   └── utils/
│       └── utils.js        # Helper functions
├── public/                 # Static assets
├── dist/                   # Build output (gitignored)
├── index.html              # Entry point
├── style.css               # Global styles
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
├── DEPLOYMENT.md           # Deployment guide
└── README.md

```

## 🛠 Technology Stack

- **Frontend Framework:** Vanilla JavaScript (ES Modules)
- **Build Tool:** Vite 5.x
- **Deployment:** Vercel
- **APIs:** 
  - Web Bluetooth API
  - Web Serial API
- **CI/CD:** GitHub Actions

## 📦 Deployment

### Automated (CI/CD)

The project uses GitHub Actions for automated deployment:

- **Push to main/master:** Deploys to production
- **Pull Requests:** Creates preview deployments
- **Status checks:** Build verification and linting

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:
```env
# Add your environment variables here
```

### Vercel Configuration

The project includes `vercel.json` for deployment settings:
- Build command: `npm run vercel-build`
- Output directory: `dist`
- Framework: Vite

## 🧪 Testing

```bash
# Check JavaScript syntax
find src -name "*.js" -type f -exec node --check {} \;

# Build verification
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Pull requests will trigger:
- Automated build checks
- Preview deployment
- Code quality validation

## 📝 License

MIT

## 🙏 Acknowledgments

- Web Bluetooth Community Group
- Vite.js team
- Vercel platform
