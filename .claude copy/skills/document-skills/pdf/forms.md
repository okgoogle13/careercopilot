# PDF Form Extraction Prompt Guide

This document provides a specialized prompt template for extracting structured data from forms (e.g., invoices, tax forms, applications) using the `pdf-text-extractor` skill.

For best results, you *must* provide a JSON schema in your prompt. This tells the model *what* to look for and *how* to format the output.

## Agent Prompt Template

When you need to extract key-value data from a form, instruct the `pdf-text-extractor` skill using a prompt like this.

**Agent's Prompt to the Skill ($PROMPT):**
```
Extract the following fields from the attached invoice (invoice-123.pdf) and return them as JSON.

Here is the JSON schema to follow:
```json
{
  "invoiceNumber": "string",
  "issueDate": "string",
  "dueDate": "string",
  "totalAmount": "string",
  "lineItems": [
    {
      "description": "string",
      "quantity": "number",
      "unitPrice": "string",
      "lineTotal": "string"
    }
  ]
}
```
```

## Expected Skill Output

The `pdf-text-extractor` skill will return a JSON object where the `output` key contains the `extractedFormFields` matching your schema.

```json
{
  "documents": [
    {
      "fileName": "invoice-123.pdf",
      "pageCount": 1,
      "output": {
        "extractedFormFields": {
          "invoiceNumber": "INV-2024-001",
          "issueDate": "2024-10-28",
          "dueDate": "2024-11-27",
          "totalAmount": "$1,500.00",
          "lineItems": [
            {
              "description": "Web Design Services",
              "quantity": 1,
              "unitPrice": "$1,000.00",
              "lineTotal": "$1,000.00"
            },
            {
              "description": "Consulting Hours",
              "quantity": 5,
              "unitPrice": "$100.00",
              "lineTotal": "$500.00"
            }
          ]
        }
      }
    }
  ]
}
```
