# Classmate Tests

This directory contains tests for the Classmate application.

## Database Tests

The `db` directory contains tests for database operations using Prisma. These tests are designed to verify that our database interactions work as expected before we migrate to Drizzle.

### Running Database Tests

1. Set up a test database:

   ```bash
   createdb classmate_test
   ```

2. Configure your test database connection in `.env.test.local`. The default is:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/classmate_test"
   ```

3. Run the tests:
   ```bash
   npm run test:db
   ```

### Test Structure

- `class.test.ts`: Tests for Class model operations (create, read, update, delete)
- `note.test.ts`: Tests for Note model operations (create, read, update, delete)

## Adding More Tests

When adding new tests:

1. Create a new test file with the `.test.ts` extension
2. Import the necessary test functions from `@jest/globals`
3. Import the Prisma client from `../setup`
4. Write your tests using the Jest testing framework

Example:

```typescript
import { describe, test, expect } from "@jest/globals";
import { prisma } from "../setup";

describe("My Test Suite", () => {
  test("should do something", async () => {
    // Test code
    expect(true).toBe(true);
  });
});
```
