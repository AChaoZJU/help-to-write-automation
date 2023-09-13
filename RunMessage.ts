const  { OpenAI } = require('langchain/llms/openai')
const { BufferMemory } = require('langchain/memory')
const { ConversationChain, LLMChain } = require('langchain/chains')
const { PromptTemplate } = require('langchain/prompts')
const axios = require('axios');
// import 'react-chat-widget/lib/styles.css';

enum MessageType {
  GenerateSQL = 0,
  ExplainSQL = 1,
}

let template: any
let prompt: any
let model: any
let memory: any
let chain: any

const defaultSCH = ''
SetSchema(defaultSCH)

export function SetSchema(schemaString: string) {
  const templatePrefix = `
      The following is a friendly conversation between a human and an AI. The AI is to generate SQL according the humen's input, AI should reply with the SQL only.
      Here are the tables we have:
      `

  const templateSuffix = `
      Current conversation:
      {history}
      Human: {input}
      AI:`

  template = templatePrefix + schemaString + templateSuffix

  prompt = new PromptTemplate({
    inputVariables: ['history', 'input'],
    template,
  })
  model = new OpenAI({ openAIApiKey: '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', temperature: 0.9 })
  memory = new BufferMemory()
  chain = new ConversationChain({ llm: model, memory, prompt })
}

// const template4Interpretor = `
// The following is a friendly conversation between a human and an AI. AI is to justify SQL according the humen's SQL input, the SQL input is auto generated by GPT. AI should justify the function of SQL as detailed and professional as possible. AI should directly answer the description without redundant word like "yes" or "sure".
//
// Human: {input}
// AI:
// `
// const prompt4Interpretor = new PromptTemplate({
//   inputVariables: ['input'],
//   template: template4Interpretor,
// })
// const model4Interpretor = new OpenAI({
//   openAIApiKey: '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',
//   temperature: 0.9,
// })
// const memory3 = new BufferMemory();
// const chain4Interpretor = new LLMChain({ llm: model4Interpretor, prompt: prompt4Interpretor })

const codeCoverage = "Line Code Coverage(PropertiesPanel: 12.38%, AttributeDisplayForms: 62:33%, AttributeDisplayFormCandidates: 100%)"
const testCases = ```Test cases(
### All related attribute
- Ancestors
  - None displayed intially

- Descendents

  - None displayed intially

### Create Relationships (top)

- Drag and drop from candidates

  - Multi select
  - Single select

- The attributes will be removed from the Candidates list once added in a relationship
- By default, the relationship type of the top zone is One-to-Many
- Added attribute

  - Display relationship

    - Select from dropdown to change the relationship
    - Many-to-Many relationship, display a warning icon

  - Display table name
  - Once attribute is added relationship type is displayed
  - Once attribute is added, all ancestors and descendants are populated

- Relationships are sorted based on the creation time
- Display total number of attributes
- Attributes added are Searchable
- Attributes added can be filtered
- Collapse/Expand
- Filter

  - Based on name
  - Based on relationship type

- Hover over on attribute displays delete icon, click to delete

### Create Relationships (bottom)

- By default, the relationship type of the bottom zone is One-to-Many
- Once the relationships are added, show the relationship type indicator on the connecting line
- Added attribute

  - Display relationship

    - Select from dropdown to change the relationship
    - Many-to-Many relationship, display a warning icon

  - Display table name
  - Once attribute is added relationship type is displayed

- Display total number of attributes
- Attributes added are Searchable
- Attributes added can be filtered
- Collapse/Expand
- Filter)```
const testCases = `# Attribute Editor

## General Functionality

### Name

- Pre populated with default value

### Lookup table

- What is displayed for a new attribute?
- set at the attribute level
- lookup table per from

\t- add a lookup tables columns at end of each row except for the form groups
\t- Can be modified by selecting from the dropdown tables
\t- All the selected tables are displayed in the dropdown
\t- If there is only 1 source table for all the expressions will this option still be shown/enabled?

- Selected based on the source table selection
- If source table is different for each form what is shown automatically?

\t- First source table of the first form is selected as lookup table

- Dropdown displays all the source tables
- Select table from dropdown to change the lookup table selection

### Save is enabled with 1 or more valid  forms

### Save is enabled when there are no unsaved data

### Advanced properties

- Opens a new advanced properties editor for the attribute
- All properties are searchable
- Show all properties toggle button

\t- ON

\t\t- Shows all the advanced properties

\t- OFF

\t\t- What is hidden?

- Import

\t- Type of files allowed?
\t- Import to populate all the feilds
\t- Any missing fields should not be populated

- Export

\t- Exports all the properties in a csv format

- Element display

\t- Lock behavior

\t\t- Select Limit will display an additional number stepper

\t- Security filter or element browsing
\t- element caching

- Dynamic sourcing

\t- Attribute validation
\t- String comparison behavior

- Joins

\t- Preserve all final pass elements
\t- Preview SQL

\t\t- Click to display the SQL

- Tables

\t- Attribute ID constraint
\t- Preview SQL

\t\t- Click to display the SQL

## Display & Sort Tab

### candidates

- All forms are displayed
- Forms are searchable
- Truncate and show tooltip for a long form name
- Context menu

\t- Hover over on each form to display
\t- Add to Report display forms
\t- Add to browse forms
\t- Add to report display sort
\t- Add to browse sort
\t- Disable the options if it is not applicable

\t\t- Form is already used
\t\t- ”same as“ option is checked

### Displays forms

- Default selection: report display tab
- "Browse forms/sorts are the same as report display" are checked
- Browse tabs are disabled intially
- Report Display

\t- All forms are selected except ID

- Browse

\t- Show when "Browse forms/sorts are the same as report display" is unchecked

- Delete icon is shown on form hover over.
Click to delete the forms
- Drag the handle to reorder the forms
- Can we save with empty display forms?

### sort criteria

- Default selection: report display tab
- "Browse forms/sorts are the same as report display" is checked
- Browse tabs are disabled intially
- Browse

\t- Show when "Browse forms/sorts are the same as report display" is unchecked

- Report Display

\t- Empty intially

- Delete icon is shown on form hover over.
Click to delete the forms
- Drag the handle to reorder the forms
- By default, the display sort is set as Descending

\t- Click to toggle between Descending and Ascending

- Can we add more than 1 form?
- Can we save with empty sort criteria?

### Drag and drop an attribute form from candidates to add to any highlighted area on hovering

- If form is already added, no action is taken

## Forms

### Add new Form

- The first form is by default set as key

- Relationship tab and Display & sort tab are disabled during form creation
- Other Information tab is disabled during form creation
- Expression editor should be open 
- If form is not the first form, Form name and category are pre-filled as DESC
- Other existing forms are disabled during form creation
- If form is the first form, only the source tables of the first form are available under All Tables

### Edit existing form

### Form name

### Category

- Select category from the displayed list
- Can we create a new category?
- Is always pre-populated 

\t- ID for first form
\t- Desc for all others

### Data type

- Display data type with precision and scale
- Edit should display all feilds
- Save
- Cancel

### Data Format

- Select from the pre-populated list
- Will changing this effect the data type?

### Formulas

- Show the expression formula
- Truncated if formula is very long

### Source table

- Will show table name is only 1 table
- Show table count if more than 1 table
- Edit to open expression editor

### Form Definition

- Tables

\t- Only 1 expression can be added at a time
\t- Tables displayed should be searchable
\t- Select 1 or more tables to show the columns
\t- Candidate table and selected table should be displayed before table selection
\t- Scrollable
\t- Candidate table will be shown only after validation
\t- Selected tables is enabled after table selection
\t- Candidate table is automatically selected after validation
\t- Selecting any non-candidate table after validation will disable the candidate tables

- Columns

\t- Columns displayed should be searchable
\t- Double click a column to add to expression
\t- Scrollable

- Done button also validates the expression
- Cancel will remove all the changes to the expression
- Cancelling an unsaved expression will delete the expression
- Expression Formula 

\t- Clicking on any  of the buttons +/-/(/) will add the operator to the expression
\t- Clicking fx will open or close the function list
\t- fx list is searchable
\t- Validate expression
\t- Clear expression
\t- Validation failure will show the error message and disable save

- Click Add new expression to add more expressions
- Entry point 1: context menu
- Entry point 2: edit icon when hovering on Expressions or Source Tables 
- Entry point 3: double-clicking on empty space of the row
- When the expression editor is on and it is not in editing mode, single clicking on empty space of another row to switch selection

\t- Form definition or other information tab selection persists

### Other information

- Form description
- Geographical role
- Image layout shape file
- Alias
- Multi languages

### Context menu

- Click on three dots on the right
- context click the form
- Single-selection (key form)

\t- Edit expression
\t- Edit other information
\t- Delete

- single-selection

\t- Edit expression
\t- Edit other information
\t- Delete
\t- Set as Key

\t\t- Set the form as key and the remove key from previous key form

- multi-selection

\t- Group

\t\t- Clicking on Group to create a new form group (compound form)
\t\t- By default, the form group name is New Form Group
\t\t- All forms in a form group will be converted into the same category
\t\t- category is the same as the first form in the list
\t\t- All other fields are N/A for a group
\t\t- Category can be changed by selecting form displayed list after group creation

\t\t\t- All forms in a form group will be converted into the same category

\t\t- Can we drag and drop other forms to add/remove from the group?

\t- Delete

- single-selection (form group)

\t- Edit expression
\t- Edit other information
\t- Delete
\t- Set as Key

\t\t- Set the group as key

- single-selection (forms in a group)

\t- Edit expression
\t- Edit other information
\t- Delete
\t- Ungroup

\t\t- Should remove from group and add as a form

### Group form

- Expression editor is not applicable for form groups
- Other information

\t- From description

## Relationships Tab

### Candidates

- All tables are displayed
- All tables are searchable
- Select table name to select all the attributes in it
- Context menu

\t- Attribute

\t\t- Add as a parent
\t\t- Add as a child

\t- Table

\t\t- Add attributes as parent
\t\t- Add attribute as children

### Auto creation

- Automatically create thee relationships

### Initially, two relationship drop-zones are empty

### All related attribute

- Ancestors

\t- None displayed intially

- Descendents

\t- None displayed intially

### Create Relationships (top)

- Drag and drop from candidates

\t- Multi select
\t- Single select

- The attributes will be removed from the Candidates list once added in a relationship
- By default, the relationship type of the top zone is One-to-Many
- Added attribute

\t- Display relationship

\t\t- Select from dropdown to change the relationship
\t\t- Many-to-Many relationship, display a warning icon

\t- Display table name
\t- Once attribute is added relationship type is displayed
\t- Once attribute is added, all ancestors and descendants are populated

- Relationships are sorted based on the creation time
- Display total number of attributes
- Attributes added are Searchable
- Attributes added can be filtered
- Collapse/Expand
- Filter

\t- Based on name
\t- Based on relationship type

- Hover over on attribute displays delete icon, click to delete

### Create Relationships (bottom)

- By default, the relationship type of the bottom zone is One-to-Many
- Once the relationships are added, show the relationship type indicator on the connecting line
- Added attribute

\t- Display relationship

\t\t- Select from dropdown to change the relationship
\t\t- Many-to-Many relationship, display a warning icon

\t- Display table name
\t- Once attribute is added relationship type is displayed

- Display total number of attributes
- Attributes added are Searchable
- Attributes added can be filtered
- Collapse/Expand
- Filter

\t- Based on name
\t- Based on relationship type

- Hover over on attribute displays delete icon, click to delete
- Add icon

\t- Create joint child
\t- Select from displayed attributes
\t- Done
\t- Cancel

### Relationship table

- The Relationship Table is by default set to the table from which the user selects the candidate
- change the relationship if there is more than one relationship table
- Check or uncheck to change apply the change to all attributes
- Apply to apply the changes
- Cancel to discard the changes

## Accessibility

### Tab navigates to next focusable element

### Shift+Tab navigates to previous focusable element

### Arrows navigate between related radio buttons, menu items, or widget items

### Enter activates a link or button, or submits a form

### Space activates a button or toggle

### Esc closes menus, modals, and other popover variations

### Entry points

### Should be able to move between native and editor

### There should not be any keyboard traps

- Should be able to move in and out of input box

## SIM

### All links and buttons should be clickable in less than 3 clicks

## UPG

### 11.2.2 Workstation with 11.2.2 Library

### 11.2.2 Workstation with 11.3 Library  

### 11.3.1 Workstation with 11.3.1 Library

## CER

### MAC: 10.13 High Sierra & 10.14 Mojave, 10.15 Catalina  

### Windows: Windows 10, Windows Server (2016, 2019 and Windows 10- 20h1 going release) 

## PER, SCA

### Increased number of forms added

### Increased number of attributes in relationships

### Increased number of source tables per each form

## INT

### All strings should be translated

### Should support in all supported languages
`

export function RunMessage(type: MessageType, newMessage: string) {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === MessageType.GenerateSQL) {
        // const res = await chain.call({ input: `${newMessage}` })
        // http://10.23.32.252:3000/v1/chat/completions
        const res = await axios.post('http://10.23.32.252:3000/v1/chat/completions', {
          model: "gpt-4-0613",
          messages: [
            { role: 'system', content: 'You will be given 2 parts of content. One is the line code coverage of the source files. The other is the test cases of the QA plan in the format of xmind. Please recommend the test cases from the given test cases to be automated to improve the code coverage.' },
            { role: 'user', content: `${codeCoverage},${testCases}` }
          ]
        });
        console.log(res.data.choices[0].message)
        resolve(res.data)
      }  else {
        console.log('Message type not supported')
        reject(new Error('Message type not supported'))
      }
    } catch (err: any) {
      console.log(err)
      reject(new Error(`GPT returns an error: ${err.message}`))
    }
  })
}

RunMessage(0, 'test').then((res) => {
  // console.log(res)
})
