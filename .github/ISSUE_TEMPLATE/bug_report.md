---
name: "🐛 Bug Report"
description: "Report a bug or unexpected behavior"
title: "[BUG] "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!

  - type: textarea
    id: description
    attributes:
      label: "Description"
      description: "A clear and concise description of what the bug is."
      placeholder: "When I do X, Y happens instead of Z..."
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: "Steps to Reproduce"
      description: "Steps to reproduce the behavior"
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: "Expected Behavior"
      description: "A clear and concise description of what you expected to happen."
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: "Actual Behavior"
      description: "A clear and concise description of what actually happened."
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: "Screenshots"
      description: "If applicable, add screenshots to help explain your problem."
      placeholder: "Drag and drop screenshots here..."

  - type: textarea
    id: environment
    attributes:
      label: "Environment"
      description: "Please provide details about your environment"
      placeholder: |
        - OS: [e.g. Windows 10, macOS 12.0]
        - Browser: [e.g. Chrome 98, Firefox 97]
        - Vue Version: [e.g. 3.2.31]
        - Package Version: [e.g. 1.0.2]

  - type: textarea
    id: additional
    attributes:
      label: "Additional Context"
      description: "Add any other context about the problem here."
      placeholder: "Any other information that might be helpful..."