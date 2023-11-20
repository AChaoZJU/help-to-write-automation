import {goThroughFiles} from "./index";
import {getFilesWithPrefix} from "./file";

export const getFeatureScenarioByTCId = (tcId: string): string => {
  const dirs =  getFilesWithPrefix(['features'])
  let featureScenario = ''

  const getTCPart = (file: string, fileContent: string) => {
    if (fileContent.match(new RegExp(tcId, 'g'))){
      // extract TC part from the fileContent
      const tcPart = fileContent.split('Scenario').slice(1).find((part: string) => {
        return part.match(new RegExp(`[${tcId}]`, 'g'))
      })
      featureScenario =  'Scenario' + tcPart?.split('\n\n').slice(0,1)
    }
  }
  goThroughFiles(dirs, getTCPart)
  return featureScenario
}

export const getStepsBySpecLines = (featureScenario: string) => {
  const dirs =  getFilesWithPrefix(['steps/editor'])
  let steps = ''
  const featureScenarioLines = featureScenario.split('\n').slice(1)

  const getSteps = (file: string, fileContent: string) => {
    const stepsInFile = fileContent.split(/(When|Then)/).map((step) => {
      // remove {string}, {number} from the the step
      return step.replace(/{.*}/g, '')
    })
    // check is there any step in stepsInFile matching that in featureScenarioLines
    // const matchedSteps = stepsInFile.filter((step) => {
    //   return featureScenarioLines.find((line) => {
    //     return line.includes(step)
    //   })
    // })
  }
  goThroughFiles(dirs, getSteps)
  return steps

}
