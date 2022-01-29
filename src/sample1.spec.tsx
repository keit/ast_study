import React from 'react'
import { mount } from 'enzyme'
import Tag from '~/common/Tag'

describe('Tag', () => {
  function getTag(kind, color) {
    return {
      id: 'tagId',
      name: 'tag name',
      short_name: 'TAG',
      kind: kind,
      zero_status: false,
      color: color
    }
  }

  it('should render the background class when the tag has a color', () => {
    const tag = getTag('management', '#676767')
    const element = mount(<Tag tag={tag} />)
    expect(element.children().hasClass('tag--676767')).toBeTruthy()
  })

  it('should render the gray background class when the tag is a cost one and does not have a color', () => {
    const tag = getTag('cost', null)
    const element = mount(<Tag tag={tag} />)
    expect(element.children().hasClass('tag--ececec')).toBeTruthy()
  })

  it('should not render the gray background class when the tag is an EMPTYTAG', () => {
    const tag = getTag('', null)
    const element = mount(<Tag tag={tag} />)
    expect(element.children().hasClass('tag--ececec')).toBeFalsy()
  })

  it('should has tag-gray class when isMainColorSet is set as true', () => {
    const tag = getTag('cost', null)
    const element = mount(<Tag tag={tag} isMainColorSet={true} />)
    expect(element.children().hasClass('tag--gray')).toBeTruthy()
    expect(element.children().hasClass('tag--ececec')).toBeFalsy()
  })
})
