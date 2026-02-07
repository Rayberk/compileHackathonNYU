# Lingo.dev SDK Integration

This project uses the Lingo.dev SDK for real-time AI-powered translation between English and Arabic.

## Configuration

The SDK is configured in `lib/lingo/context.tsx` with the following features:
- Automatic translation based on selected language
- Context-based state management
- Client-side translation using the Lingo.dev API

## Usage Examples

### 1. Using the Context Directly

```tsx
"use client";
import { useLingoContext } from "@/lib/lingo/context";

export function MyComponent() {
  const { locale, translateText } = useLingoContext();
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    translateText("Hello World").then(setTranslatedText);
  }, [locale]);

  return <div>{translatedText}</div>;
}
```

### 2. Using the Translation Hooks (Recommended)

```tsx
"use client";
import { useTranslate } from "@/lib/lingo/hooks";

export function MyComponent() {
  const greeting = useTranslate("Hello World");
  const message = useTranslate("Welcome to TransitUAE");

  return (
    <div>
      <h1>{greeting}</h1>
      <p>{message}</p>
    </div>
  );
}
```

### 3. Translating Objects

```tsx
"use client";
import { useTranslateObject } from "@/lib/lingo/hooks";

export function MyComponent() {
  const content = {
    title: "Dashboard",
    subtitle: "Transit Analytics",
    description: "Real-time transit data visualization"
  };

  const translatedContent = useTranslateObject(content);

  return (
    <div>
      <h1>{translatedContent.title}</h1>
      <h2>{translatedContent.subtitle}</h2>
      <p>{translatedContent.description}</p>
    </div>
  );
}
```

### 4. Translating Dynamic Content

For dynamic content like API responses or user-generated content:

```tsx
"use client";
import { useLingoContext } from "@/lib/lingo/context";

export function ChatMessage({ message }: { message: string }) {
  const { translateText, locale } = useLingoContext();
  const [translated, setTranslated] = useState(message);

  useEffect(() => {
    if (locale !== "en") {
      translateText(message).then(setTranslated);
    } else {
      setTranslated(message);
    }
  }, [message, locale, translateText]);

  return <div className="chat-message">{translated}</div>;
}
```

## Language Switcher

The language switcher is available in the navbar and controls the global locale:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher";

// Already included in the navbar, but can be used anywhere
<LanguageSwitcher />
```

## API Key Setup

Make sure you have set up your Lingo.dev API key in `.env`:

```env
NEXT_PUBLIC_LINGODOTDEV_API_KEY=your_api_key_here
```

## Performance Tips

1. **Avoid over-translation**: Only translate user-facing text, not technical strings or IDs
2. **Memoize translations**: The hooks automatically cache translations per locale
3. **Batch translations**: Use `translateObject` for multiple related strings
4. **Fast mode**: For time-sensitive applications, pass `fast: true` option:

```tsx
const { translateText } = useLingoContext();
const result = await translateText("Quick message", "en", { fast: true });
```

## Supported Languages

- English (en) - Default
- Arabic (ar)

## Files

- `lib/lingo/context.tsx` - Context provider and SDK initialization
- `lib/lingo/hooks.ts` - Convenience hooks for translations
- `components/language-switcher.tsx` - Language selection UI
