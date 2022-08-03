# Meteorite Explorer

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)

## Overview

Chingu project (tier 3) to display meteorite strikes, listed alphabetically.

## Features

## Dependencies

Backend

- Express
- GraphQl

Frontend

- React
- Framer Motion

## Setup and Installation

## Running the App

## ToDo List

**Structure**

- [ ] Review the NASA Open Data Portal
      [documentation](https://nasa.github.io/data-nasa-gov-frontpage/) for the
      Meteorite Landing dataset. Look for:
  - API endpoint
  - Understand the available data fields and their formats
  - How to retrieve the dataset from the NASA Open Data Portal
- [ ] Setup the top-level parent component for the application containing
  - Search panel
  - Search results display area (tabular format)
- [ ] Create the search panel containing:
  - Input text field for entry of search terms
  - Search button
- [ ] Create a search results panel containing results in tabular format as a
      collection of individual components containing the attributes of Meteorites
      meeting the search criteria.
- [ ] Create a Meteorite component that is a stateless description of a single
      meteorite strike. Iterate over the meteorite landing dataset, and create the
      collection of Meteorite components for the entries matching the search criteria
      specified by the user.

**Style**

- [ ] You may implement any style you choose. However, it should be consistent
      (e.g. font, font size, color scheme, layout, etc.).
  - See [Consistent Web Design](https://1stwebdesigner.com/consistent-web-design/)
  - See [Why is consistency important in Web Design?](https://laceytechsolutions.co.uk/blog/importance-of-consistency-in-web-design/)

**Functionality**

- [ ] Meteorite landings are displayed in alphabetical order on the Name column.
- [ ] Users may scroll through the list of landings, or use the search box to
      search for a names that include the entered search term.
- [ ] Searches are case independent. This means the user may type searches in
      lower, upper, or mixed case (like Case, case, or cASe) and the same results
      will be returned.
- [ ] The results list can be reset to its original contents by clearing the
      search box and clicking the 'Search' button

**Other**

- [ ] Your repo needs to have a robust `README.md` (see
      [Keys to a Well-Written Readme](https://medium.com/chingu/keys-to-a-well-written-readme-55c53d34fe6d))
- [ ] Make sure that there are no errors in the developer console before
      submitting
- [ ] Make sure you have handled edge cases such as,
  - What happens if the API request takes too long?
  - What if the API returns an error?
  - What if the user submits an empty string?
  - What if the user enters garbage as search criteria?
  - What if the API returns 0 results?
- [ ] Deploy your website <br/>
      Once you're done with the requirements and the console is free of
      errors, deploy your application. You can use services like
      Netlify or Heroku. It's up to you!
- [ ] Make your design fully responsive (see
      [Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive))

**Extras (Not Required)**

- [ ] When the user begins typing search terms display a dropdown with the
      last 10 search terms. This should be updated to match what the user enters
      as she types.
- [ ] Use Accessibility techniques (see
      [The A11Y Project](https://a11yproject.com/)) to improve your site for users
      with impairments

## Contributing to Meteorite Explorer

## Contributors

## Contact

## License
