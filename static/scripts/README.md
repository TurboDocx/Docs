# TurboDocx Code Scripts

This directory contains reusable, testable code examples for TurboDocx integrations and features.

## Structure

```
scripts/
├── webhooks/
│   └── verification/
│       ├── nodejs.js
│       ├── python.py
│       ├── php.php
│       ├── csharp.cs
│       └── java.java
├── integrations/
│   ├── salesforce/
│   ├── hubspot/
│   └── zoom/
└── api/
    └── examples/
```

## Usage in Documentation

### Using ScriptLoader Component

```jsx
import ScriptLoader from '@site/src/components/ScriptLoader';

<ScriptLoader 
  scriptPath="webhooks/verification" 
  id="webhook-examples"
  label="Webhook Verification Examples"
/>
```

### Manual Import

You can also import specific scripts directly:

```jsx
import webhookScript from '@site/scripts/webhooks/verification/nodejs.js';
```

## Adding New Scripts

### 1. Create Script Files

Create script files in the appropriate directory structure:
- `webhooks/` - Webhook-related functionality
- `integrations/` - Third-party integrations
- `api/` - API usage examples

### 2. Follow Naming Conventions

- `nodejs.js` - Node.js/Express examples
- `python.py` - Python/Flask examples  
- `php.php` - PHP examples
- `csharp.cs` - C#/.NET examples
- `java.java` - Java/Spring examples

### 3. Script Structure

Each script should:
- Be production-ready and testable
- Include proper error handling
- Have comprehensive documentation
- Export/expose functions for testing
- Include usage examples

### 4. Testing

Scripts should be testable independently:

```bash
# Node.js
npm test scripts/webhooks/verification/nodejs.test.js

# Python  
pytest scripts/webhooks/verification/test_python.py

# Java
mvn test -Dtest=WebhookVerificationServiceTest
```

## Benefits

- **Testability**: Scripts can be unit tested independently
- **Maintainability**: Code is organized and version controlled
- **Developer Experience**: Easy to copy/paste working examples
- **Consistency**: Standardized patterns across languages
- **Documentation**: Living examples that stay up-to-date

## Guidelines

1. **Security First**: Never hardcode secrets or credentials
2. **Error Handling**: Always include proper error handling
3. **Documentation**: Add comprehensive comments and docstrings
4. **Testing**: Include test files alongside implementation
5. **Dependencies**: Keep external dependencies minimal
6. **Standards**: Follow language-specific coding standards