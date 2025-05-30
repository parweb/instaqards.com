# Prisma Multi-File Schema Structure

This project uses Prisma's multi-file schema feature to organize the database models in a logical and maintainable way.

## File Organization

### Main Configuration

- **`schema.prisma`** - Contains datasource and generator configurations

### Domain-Specific Models

#### User Management

- **`models/user.prisma`** - User model, UserRole enum, Message, and Feedback models

#### Authentication

- **`models/auth.prisma`** - Authentication-related models:
  - Account, Session, Authenticator
  - TwoFactorConfirmation, TwoFactorToken, PasswordResetToken
  - Verification

#### Billing & Subscriptions

- **`models/billing.prisma`** - Payment and subscription models:
  - Customer, Product, Price, Subscription
  - PricingType, PricingPlanInterval, SubscriptionStatus enums

#### Site Management

- **`models/site.prisma`** - Website and content models:
  - Site, Block, Link, Click, Like
  - Subscriber, Reservation

#### Content & Social

- **`models/content.prisma`** - Content and social features:
  - Feed, Comment
  - FeedType enum

#### Marketing & Communication

- **`models/marketing.prisma`** - Marketing and email models:
  - Outbox, List, Campaign, Email
  - CampaignType enum

#### Workflow & Automation

- **`models/workflow.prisma`** - Workflow and automation models:
  - Queue, Action, Workflow, Trigger, Rule
  - Condition, RuleCondition, Event, WorkflowState, Execution
  - ConditionType, Operator, WorkflowStateStatus, ExecutionStatus enums

#### Location & Geography

- **`models/location.prisma`** - Geographic and location models:
  - City, NafSection, NafDivision, NafGroup, NafClass, NafCode

#### System & Infrastructure

- **`models/system.prisma`** - System and infrastructure models:
  - Cron, History

## Benefits of This Structure

1. **Better Organization** - Related models are grouped together logically
2. **Easier Maintenance** - Changes to specific domains are isolated
3. **Improved Collaboration** - Team members can work on different domains without conflicts
4. **Clearer Dependencies** - Relationships between models are more apparent
5. **Scalability** - Easy to add new domains or split existing ones

## Usage

The Prisma CLI automatically detects the multi-file schema structure. All standard Prisma commands work as usual:

```bash
# Generate client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Validate schema
bunx prisma validate

# Open Prisma Studio
bunx prisma studio
```

## Configuration

The schema location is configured in `package.json`:

```json
{
  "prisma": {
    "schema": "./prisma"
  }
}
```

## Adding New Models

When adding new models:

1. Determine which domain the model belongs to
2. Add it to the appropriate file in the `models/` directory
3. If it's a new domain, create a new file following the naming convention
4. Ensure all relationships are properly defined across files
