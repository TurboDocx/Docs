---
name: Change Request
about: Record a change for change management / SOC 2
title: "type(scope): short description"
labels: ["change"]
---

<!-- One issue = one change. The implementing PR closes it with "Closes #<issue>".
Standard changes (Dependabot updates, docs, low-risk config) don't need an issue —
the merged PR is the record on its own. -->

**Change type:** Standard | Planned | Emergency
**Repo / component:**
**Environment:** main → published site | hotfix
**Risk / impact:** Low | Medium | High —
**Security impact assessed:** Yes | No —
**Requested by:**

### Description & rationale


### Testing / validation
- [ ] CI / build passes on the implementing PR
- [ ] Preview/build verified (or state why N/A)
- Evidence: <link to PR / CI run>

### Rollback plan
<!-- Usually: revert the merge commit. -->


### Deployment notes
- [ ] Breaking change or needs advance stakeholder notice?

### Approvals
<!-- PR review approval satisfies this. For an emergency self-merge, name the post-merge reviewer. -->
- Reviewer(s):
