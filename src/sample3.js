/// <reference types="Cypress" />

import { userReportTest as user } from '../../fixtures/users'

// currently we can't get the correct revised for milk as the
// dairy season is hardcoded in parts & we use dynamic fin years
const doRunMPSpecs = false
const workingPlan = user.defaultFarm.workingPlan

context('Variance Rpt', () => {
  beforeEach(() => {
    cy.login(user)

    cy.contains(user.defaultFarm.name)
    cy.contains('Bank Balances')
    cy.contains('ANZ . Test account')
  })

  it('Variance report is correct', () => {
    gotoCashBasedVarianceReport()
    checkCashBasedVarianceReportVsWorkingPlan()
    checkCashBasedVarianceReportVsActuals()
    checkFinancialYearBasedVarianceReportVsActuals()
  })

  it('YTD Variance report is correct', () => {
    gotoCashBasedYTDVarianceReport()
    checkCashBasedYTDVarianceReportVsWorkingPlan()
    switchToFinancialYearYTDVarianceReport()
    checkFinancialYearYTDVarianceReportVsWorkingPlan()
    checkCashBasedYTDVarianceReportActualVsPlanWithRemainingCol()
  })
})

const gotoCashBasedVarianceReport = () => {
  cy.getSelector('side-bar-Reports').click()
  cy.contains('Variance').click()
  selectCompareToWorkingPlan()
  runReport()
}

const checkCashBasedVarianceReportVsWorkingPlan = () => {
  // Rows
  cy.contains('INCOME')

  cy.contains('Milk Production').click()
  cy.contains('This Seasons')

  if (doRunMPSpecs) {
    cy.reportLevel3Has({ row: 'This Seasons', col: 2, value: '152,448' })
    cy.reportLevel3Has({ row: 'This Seasons', col: 3, value: '40,100' })
  }

  cy.contains('Milk Production Total')
  cy.contains('PURCHASES')
  cy.contains('NET INCOME')
  cy.contains('FARM EXPENDITURE')

  if (doRunMPSpecs) {
    cy.reportTotalRowHas({
      row: 'Income Total',
      col: 2,
      value: '189,187'
    })
    cy.reportTotalRowHas({
      row: 'Income Total',
      col: 4,
      value: '148,700'
    })

    // cy.get(`level-one-row-INCOME`).within(() => {
    cy.reportLevel2Has({ row: 'Dairy (Sales)', col: 2, value: '36,739' })
    cy.reportLevel2Has({ row: 'Dairy (Sales)', col: 3, value: '(47)' })
    cy.reportLevel2Has({ row: 'Dairy (Sales)', col: 4, value: '52,000' })
    cy.reportLevel2Has({ row: 'Dairy (Sales)', col: 5, value: '(72)' })
  }

  cy.contains('Dairy').click()
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 2, value: '23,043' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 3, value: '(29)' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 4, value: '27,000' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 5, value: '(36)' })

  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 2, value: '13,696' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 3, value: '(18)' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 4, value: '25,000' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 5, value: '(36)' })

  cy.reportLevel2Has({ row: 'Animal Health', col: 2, value: '51,652' })
  cy.reportLevel2Has({ row: 'Farm Working', col: 2, value: '55,500' })
  cy.contains('Animal Health').click()

  cy.reportLevel3HasValues({
    row: 'Vaccines',
    values: { '2': '20,413', '4': '22,000', '6': '(1,587)', '8': '7 %' }
  })
  cy.reportLevel3HasValues({
    row: 'Minerals',
    values: { '2': '31,239', '4': '38,500', '6': '(7,261)', '8': '23 %' }
  })

  cy.reportTotalRowHas({
    row: 'Animal Health Total',
    col: 2,
    value: '51,652'
  })

  // col headers
  cy.contains('Actuals + Working')
  cy.contains(workingPlan.name)
  cy.contains('Variance')

  if (doRunMPSpecs) {
    // totals
    cy.reportLevel1Has({
      row: 'FIN YEAR SURPLUS',
      col: 2,
      value: '(747,139)'
    })
    cy.reportLevel1Has({ row: 'FIN YEAR SURPLUS', col: 4, value: '430,700' }) // working plan
    cy.reportLevel1Has({
      row: 'FIN YEAR SURPLUS',
      col: 6,
      value: '(1,177,839)'
    }) // Variance
    cy.reportLevel1Has({ row: 'FIN YEAR SURPLUS', col: 8, value: '(174) %' }) // Variance %

    cy.reportLevel1Has({ row: 'GST', col: 2, value: '(137,633)' })
    cy.reportLevel1Has({ row: 'GST', col: 4, value: '6,615' })
  }
}

const checkCashBasedVarianceReportVsActuals = () => {
  openModal()
  selectActualsWithin({ withinSelector: 'report-comparison-panel-two' })
  runReport()
  expandLevelTwo()

  // Rows
  cy.contains('INCOME')

  cy.reportLevel2Has({ row: 'Dairy (Sales)', col: 4, value: '800,000' })
  cy.reportLevel2Has({ row: 'Dairy (Sales)', col: 5, value: '(125)' })

  cy.contains('Dairy').click()
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 2, value: '23,043' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 4, value: '13,043' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 5, value: '(15)' })

  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 4, value: '91,304' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 5, value: '(100)' })

  cy.reportLevel3Has({ row: '2 Yr Steers & Bulls', col: 4, value: '695,652' })
  cy.reportLevel3Has({ row: '2 Yr Steers & Bulls', col: 5, value: '(10)' })

  // actual only
  if (doRunMPSpecs) {
    cy.reportLevel2Has({ row: 'Animal Health', col: 2, value: '51,652' })
  }
  cy.reportLevel2Has({ row: 'Animal Health', col: 4, value: '11,217' })
  cy.reportLevel2Has({ row: 'Farm Working', col: 4, value: '23,478' })
  cy.contains('Animal Health').click()

  if (doRunMPSpecs) {
    cy.reportLevel3HasValues({
      row: 'Vaccines',
      values: { '2': '20,413', '4': '3,913', '6': '16,500', '8': '521 %' }
    })

    cy.reportLevel3HasValues({
      row: 'Minerals',
      values: { '2': '31,239', '4': '7,304', '6': '23,935', '8': '427 %' }
    })
  }

  cy.reportTotalRowHas({
    row: 'Animal Health Total',
    col: 4,
    value: '11,217'
  })

  if (doRunMPSpecs) {
    // totals
    cy.reportLevel1Has({
      row: 'FIN YEAR SURPLUS',
      col: 2,
      value: '(747,139)'
    }) // Actuals + Working
    cy.reportLevel1Has({ row: 'FIN YEAR SURPLUS', col: 4, value: '104,435' }) // Actuals
    cy.reportLevel1Has({
      row: 'FIN YEAR SURPLUS',
      col: 6,
      value: '(642,704)'
    }) // Variance
    cy.reportLevel1Has({ row: 'FIN YEAR SURPLUS', col: 8, value: '715 %' }) // Variance %
  }
}

const checkFinancialYearBasedVarianceReportVsActuals = () => {
  // select compare to plan in Financial view
  openModal()
  cy.contains('Financial view').click()
  runReport()
  expandLevelTwo()

  cy.contains('INCOME')

  cy.contains('Dairy').click()
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 2, value: '23,043' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 3, value: '(29)' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 4, value: '13,043' })
  cy.reportLevel3Has({ row: '2 Yr Heifers', col: 5, value: '(15)' })

  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 2, value: '13,696' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 3, value: '(18)' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 4, value: '91,304' })
  cy.reportLevel3Has({ row: '1 Yr Heifers', col: 5, value: '(100)' })

  cy.reportLevel2Has({ row: 'Animal Health', col: 2, value: '60,230' })
  cy.reportLevel2Has({ row: 'Fertiliser', col: 2, value: '14,743' })
  cy.reportLevel2Has({ row: 'Farm Working', col: 2, value: '62,235' })
  cy.contains('Animal Health').click()

  cy.reportLevel3HasValues({
    row: 'Vaccines',
    values: { '2': '24,213', '4': '3,913', '6': '20,300', '8': '84 %' }
  })
  cy.reportLevel3HasValues({
    row: 'Minerals',
    values: { '2': '36,017', '4': '6,783' }
  })

  cy.reportTotalRowHas({
    row: 'Animal Health Total',
    col: 2,
    value: '60,230'
  })
}

const checkCashBasedYTDVarianceReportActualVsPlanWithRemainingCol = () => {
  openModal()
  selectActualsWithin({ withinSelector: 'report-comparison-panel-one' })
  // selectPlanWithin({ withinSelector: 'report-comparison-panel-two' })
  cy.contains('View YTD Remaining column').click()
  cy.contains('Payment date').click()
  runReport()
  expandLevelTwo()

  // col header for remaining column
  cy.contains('YTD Actuals')

  cy.contains('Animal Health').click()
  // remaining is column 16
  cy.reportLevel3HasValues({
    row: 'Vaccines',
    values: { '4': '2,000', '16': '18,087' }
  })

  cy.reportLevel3HasValues({
    row: 'Minerals',
    values: { '2': '1,565', '4': '3,500', '16': '31,196' }
  })
}

const gotoCashBasedYTDVarianceReport = () => {
  cy.getSelector('side-bar-Reports').click()
  cy.contains('YTD Variance').click()
  selectCompareToWorkingPlan()
  runReport()
}

const checkCashBasedYTDVarianceReportVsWorkingPlan = () => {
  expandLevelTwo()
  cy.contains('INCOME')
  cy.contains('Animal Health').click()
  cy.reportLevel3HasValues({
    row: 'Vaccines',
    values: { '2': '2,000', '4': '2,000', '9': '5,913', '11': '7,500' }
  })
}

const selectActualsWithin = ({ withinSelector }) => {
  cy.getSelector(withinSelector).within(() => {
    cy.getSelector('compare-Actuals')
      .parent()
      .click()
    cy.contains(workingPlan.yearRange).click()
  })
}

const selectPlanWithin = ({ withinSelector }) => {
  cy.getSelector(withinSelector).within(() => {
    cy.getSelector('compare-Plan')
      .parent()
      .click()
    cy.contains(workingPlan.yearRange)
    cy.contains('Select plan').click()
    cy.contains(workingPlan.name).click()
  })
}

const switchToFinancialYearYTDVarianceReport = () => {
  openModal()
  cy.contains('Financial view').click()
  runReport()
}

const checkFinancialYearYTDVarianceReportVsWorkingPlan = () => {
  expandLevelTwo()
  cy.contains('INCOME')

  cy.contains('Animal Health').click()
  cy.reportLevel3HasValues({
    row: 'Vaccines',
    values: { '2': '2,300', '4': '2,300' }
  })
  cy.reportLevel2Has({ row: 'Fertiliser', col: 9, value: '14,743' })
}

const openModal = () => cy.getSelector('settings-button').click()
const runReport = () => cy.contains('Apply').click()
const expandLevelTwo = () =>
  cy
    .getSelector('report-expander-level-two')
    .first()
    .click()

const selectCompareToWorkingPlan = () => {
  selectPlanWithin({ withinSelector: 'report-comparison-panel-two' })
}
