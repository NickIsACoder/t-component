import { shallowMount } from '@vue/test-utils';
import { Radio } from '../../../packages/index';

describe('Radio', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Radio);
  });
  it('create', (done) => {
    wrapper.setProps({
      value: '1',
    });
    wrapper.find('.t-radio-wrapper-input').setChecked(true);
    expect(wrapper.emitted('change')[0]).to.eql(['1']);
    setTimeout(() => {
      wrapper.setProps({ checked: '1' });
      expect(wrapper.emitted('input')[0]).to.eql(['1']);
      done();
    }, 10);
  });
  it('disabled', () => {
    wrapper.setProps({
      disable: true,
    });
    expect(wrapper.find('is-disabled')).to.be.not.empty;
    wrapper.find('.t-radio-wrapper-input').setChecked(true);
    expect(wrapper.emitted('change')).to.be.undefined;
  });
});
