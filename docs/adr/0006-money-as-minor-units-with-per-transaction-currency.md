# Money as integer minor units, with currency stored per Transaction

Amounts are stored and transmitted as positive `bigint` integers in the currency's minor unit, using the ISO 4217 exponent (USD=2, VND=0, JPY=0). Each Transaction stores its own `currency`, defaulted from the User's base currency at creation. Changing the base currency in User Settings only affects Transactions created afterwards; existing ones are never converted.

## Considered Options

- Fixed 2 decimals for every currency: rejected, it inflates VND/JPY values for no reason.
- `numeric(18,2)` with string amounts: rejected, easy to mix up with floats on the client and still ignores per-currency exponents.
- Block base-currency change once Transactions exist: rejected, too restrictive; storing `currency` per row keeps history truthful.

## Consequences

- Contract schemas validate `amount` as a positive safe integer; the frontend converts to display values with `Intl.NumberFormat` using the currency's exponent.
- Sign comes from Transaction Type, never from `amount`.
- Aggregations (dashboard, reports) must group by `currency` and must not sum across currencies until a conversion strategy is decided.
