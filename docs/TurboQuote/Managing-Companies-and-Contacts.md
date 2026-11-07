---
title: Managing Companies and Contacts
sidebar_position: 6
description: Add and edit the companies you quote and the contacts who receive and sign your TurboQuote quotes, and see why a company or contact with open quotes can't be deleted.
keywords:
  - turboquote
  - companies
  - contacts
  - customers
  - add company
  - add contact
  - company email
  - TurboDocx
---

# Managing Companies and Contacts

**Companies** are the businesses you quote. **Contacts** are the people at those companies who receive and sign your quotes. Every quote is made out to one contact.

## What You'll Accomplish

By the end of this guide, you will know how to:

- 🏢 **Add a company** together with its first contact
- 👤 **Add and edit contacts** at a company
- ✏️ **Edit a company**, including its email address
- 🛑 **Understand why** a company or contact with open quotes can't be deleted

<br/>

## The Companies Page

In the sidebar, open **TurboQuote** and click **Companies**. Each company shows its industry, email, phone, number of contacts and when it last had activity. Search by name, email, city, state or country, or use **Filter** and **Sort** to narrow the list.

![The Companies page with the New company button](/img/turboquote/companies/01-companies.png)

<br/>

## Add a Company

**Instruction:**

1. Click **New company**.
2. Enter the **Company name**, and optionally the **Industry**, **Email**, **Phone**, **City**, **State or province** and **Country**.
3. Under **Contacts**, fill in **Contact 1**: a **Name** and **Email** are required, **Title** and **Phone** are optional. A company needs at least one contact so you can send it quotes. Click **Add another contact** to add more.
4. Click **Create company**.

![The New company dialog with the Contacts section](/img/turboquote/companies/07-new-company.png)

:::tip Adding a company while making a quote
On the **Who is this quote for?** page of a new quote, click **Add new** and choose **New company** or **New contact**. The new contact is then picked for the quote.
:::

<br/>

## Add a Contact

**Instruction:**

1. Click a company's name to open its **Contacts** page.
2. Click **Add contact**.
3. Enter the **Name** and **Email**, and optionally the **Title** and **Phone**.
4. Click **Add contact**.

![A company's Contacts page with the Add contact button](/img/turboquote/companies/02-company-contacts.png)

![The Add contact dialog](/img/turboquote/companies/03-add-contact.png)

To change a contact, click the **⋮** button on their row and choose **Edit contact**. To add many contacts at once, click **Import** on the Contacts page.

<br/>

## Edit a Company

Click **Edit company** at the top of the company's page, or choose **Edit company** from the **⋮** menu on the Companies page. Here you can change the name, industry, **Email**, phone and location.

![The Edit company dialog with the company email](/img/turboquote/companies/05-edit-company.png)

<br/>

## Deleting Companies and Contacts

A company or contact that is on **open quotes** (drafts or sent quotes) can't be deleted. TurboQuote lists the quotes that are in the way, with a link to each one, so you can finish, void or move them first.

![Can't delete Maria Anders: 1 open quote uses it](/img/turboquote/companies/04-contact-delete-blocked.png)

![Can't delete Contoso Ltd: 2 open quotes use it](/img/turboquote/companies/06-company-delete-blocked.png)

:::note A company keeps at least one contact
A company's **last contact** can't be deleted. Add another contact first, or delete the company instead.
:::

The same rules apply through the API, the SDKs and n8n, which return a `409` error naming the reason.

<br/>

## Summary

1. A **company** needs at least one **contact**, who receives and signs its quotes
2. Add contacts from the company's **Contacts** page, or while making a quote
3. Companies and contacts on **open quotes** can't be deleted, and a company always keeps its last contact

## Related

- [Creating a New Quote](./Creating-a-New-Quote.md)
- [Bulk Importing from a Spreadsheet](./Bulk-Importing-from-a-Spreadsheet.md)
- [Managing Categories](./Managing-Categories.md), for company industries
