import React from 'react'
import { shallow } from 'enzyme'
import { TableRow } from '~/activity/matching/TableRow'

describe('TableRow', () => {
  let props

  beforeEach(() => {
    props = {
      drivingLineId: '12345678',
      toggleRowSelected: jest.fn(),
      row: {
        index: 1,
        cells: [
          {
            column: {
              id: 1
            },
            id: 'payment_date',
            value: '10th Dec',
            getCellProps: jest.fn(),
            render: jest.fn()
          },
          {
            column: {
              id: 2
            },
            id: 'other_party',
            value: 'Kate',
            getCellProps: jest.fn(),
            render: jest.fn()
          }
        ],
        isSelected: false,
        getRowProps: jest.fn(),
        original: {
          id: '12345678'
        }
      }
    }
  })

  it('renders a td for each cell', () => {
    const component = shallow(<TableRow {...props} />)
    const tableCells = component.find('td')
    expect(tableCells.length).toBe(2)
  })

  it('Calls the toggleRowSelected function when the row is clicked', () => {
    const component = shallow(<TableRow {...props} />)
    const tableRow = component.find('tr')
    const mockEvent = { preventDefault: jest.fn }
    tableRow.simulate('click', mockEvent)
    expect(props.toggleRowSelected).toHaveBeenCalledWith(1)
  })

  it('Has the driving line class name when the row is the driving line', () => {
    const component = shallow(<TableRow {...props} />)
    const tableRow = component.find('tr')
    expect(tableRow.props().className).toContain(
      'matching-table__row-driving-line'
    )
  })

  it('Has the selected row class name when the row is selected', () => {
    props.row.isSelected = true
    const component = shallow(<TableRow {...props} />)
    const tableRow = component.find('tr')
    expect(tableRow.props().className).toContain('matching-table__row-selected')
  })

  it('Has the token row class name when the row has a token', () => {
    // Set tokenCellCount to 2
    const stubUseState = React.useState
    jest.spyOn(React, 'useState').mockImplementationOnce(() => stubUseState(2))
    const component = shallow(<TableRow {...props} />)
    const tableRow = component.find('tr')
    expect(tableRow.props().className).toContain('token-row')
  })
})
