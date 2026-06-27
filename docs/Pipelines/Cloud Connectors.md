---
title: Cloud Connectors (Enterprise)
sidebar_position: 5
description: Resolve signer details from systems behind your firewall. A Cloud connector runs inside your network, makes only outbound HTTPS calls to TurboDocx, and keeps your data in place. No inbound firewall access required.
keywords:
  - cloud connectors
  - signer resolution
  - internal database lookup
  - behind firewall integration
  - outbound https
  - secure signer lookup
  - enterprise connector
  - no inbound firewall
  - api key authentication
  - on-premise lookup
  - private system integration
  - white-glove setup
---

# Cloud Connectors (Enterprise)

Sometimes the details you need to send a document for signature — the signer's email, their name — live in a system TurboDocx can't reach directly: an internal database behind your firewall, or an internal API that never faces the public internet. A **Cloud connector** bridges that gap, securely, without ever exposing your systems.

:::info Enterprise feature
Cloud connectors are an **Enterprise** feature, configured with help from our team. **[Contact us](mailto:team@turbodocx.com)** to set one up for your organization.
:::

<br/>

## What a Cloud Connector Does

A Cloud connector is a lightweight worker you run **inside your own network**. When a pipeline needs to look up a signer in one of your private systems, the connector handles that lookup locally and returns just the values needed to proceed.

Here's the flow in plain language:

1. A document arrives and the pipeline needs to resolve the signer from your internal system.
2. The pipeline **parks the run** and posts the lookup request to TurboDocx.
3. Your connector, running inside your network, **polls TurboDocx** for any pending lookups.
4. It **queries your system locally** — your database, your internal API — and gets the answer.
5. It **returns the resolved values** to TurboDocx, and signing proceeds with the correct signer.

Your sensitive systems are queried where they live. Only the resolved result — the signer's name and email for that document — travels back to TurboDocx.

<br/>

## Built for Security

The connector model is designed so your network stays sealed:

- **TurboDocx never reaches into your network.** There is no inbound connection from us to you.
- **Your connector makes only outbound HTTPS calls** to TurboDocx — the same kind of secure, outbound web traffic your systems already make.
- **No inbound firewall holes.** Because everything is initiated from inside your network, you don't open any ports or expose any internal systems to the internet.
- **Authenticated with an org-scoped API key**, so only your connector can pick up and answer your organization's lookups.

This keeps your databases and internal APIs exactly where they are — behind your firewall — while still letting pipelines resolve signers from them.

:::tip Why this matters
Your most sensitive lookups (customer records, internal directories) never have to be copied to the cloud or exposed through a public endpoint. The data stays in your environment; only the answer leaves.
:::

<br/>

## When to Use a Cloud Connector

Reach for a Cloud connector when the signer for a document can't be determined from the document itself or a static value, and instead must be looked up in a system only your network can reach — for example:

- The signer is an account owner stored in an **internal database**.
- The right recipient comes from an **internal API** or directory service.
- Signer assignment depends on business logic that lives in **your own systems**.

For simpler cases — a single fixed signer, or a signer whose email is printed on the document — you can use a static signer or an extracted field instead. See **[Creating an E-Signature Pipeline](./Creating%20an%20E-Signature%20Pipeline)** for those options.

<br/>

## Getting Set Up

Cloud connectors are configured **white-glove** by our team. We'll work with you to stand up a connector inside your network, scope its access, and wire it into your pipeline's signer resolution.

<br/>

## Contact Sales

- **Email**: [team@turbodocx.com](mailto:team@turbodocx.com)
- **Schedule a Demo**: See how a connector resolves a signer from an internal system end-to-end.
- **Custom Setup**: We'll help connect a pipeline to your database or internal API securely.
