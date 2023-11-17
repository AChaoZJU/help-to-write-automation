export const stepsToBeAutomated = "Candidate forms can be searched using the search box. \"No results found\" is shown when there are no results matching the search string. Forms from search results should be able to add to on drag and drop"
    // "Expand relationship type dropdown to choose the type from the displayed list. By default, the relationship type is One to Many. User can change it to One to One or Many to Many.  Many-to-Many relationship, display a warning icon as it is not recommended."

// @ts-ignore
export const examples = [
    {
      input: `Test case TC73045 steps:
      1 Expand relationship type dropdown to choose the type from the displayed list.
      2 By default, the relationship type is One to Many.
      3 User can change it to One to One or Many to Many.
      4 Many-to-Many relationship, display a warning icon as it is not recommended.`,
      output: `Code of the automated test case:
      Features:
      Scenario: [TC73045] Relationship: Change relationship type of attributes added for parent or child in attribute editor
When open attribute "Customer" in project "_MicroStrategy Tutorial (Attribute)" through workstation api
And I wait for "Customer" attribute to load
When I click on main "Relationships" tab
Then the relationship of the attribute "Customer Age" in "parent" panel is "1 : N"
When I update the relationship of attribute "Customer Age" in "parent" panel to "N : N"
Then the relationship status of the attribute "Customer Age" in "parent" panel is "warning"
And I close Editor "Customer"
And I select popup button "No"
Then "Customer" Editor should be disappeared
      Steps:
  Then ('the relationship of the attribute {string} in {string} panel is {string}', async (attributeName, panelName, relationship) => {
    const actualRelationship = await relationshipsTab.getRelationship(attributeName, panelName)
    expect(actualRelationship).equal(relationship)
  })

Then('the relationshop status of the attribute {string} in {string} panel is {string}', async(attributeName, panelName, relationship) => {
  const actualRelationshipStatus = await relationshipsTab.getRelationshipStatus(attributeName, panelName)
  expect(actualRelationshipStatus).equal(relationship)
})

When ('I update the relationship of attribute {string} in {string} panel to {string}', async (attributeName, panelName, relationship) => {
  await relationshipsTab.updateRelationship(attributeName, panelName, relationship)
})

Utils:
  async getAttributeInDropzone(attributeName, panelName) {
  const targetPanel = panelName  === 'parent' ? await this.getParentPanel() : await this.getChildrenPanel()
  return await targetPanel.element(by.xpath(\`.//span[text()='\${attributeName}']/ancestor::div[contains(@class,'mstr-attribute-relationship-pair-container')]\`))
}

async getRelationshipSelect(attributeName, panelName) {
  const attributeContainer = await this.getAttributeInDropzone(attributeName, panelName)
  return await attributeContainer.$('.ant-select-selection-item')
}
 `
  }
]
