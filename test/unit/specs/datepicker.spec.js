import { mount } from '@vue/test-utils';
import { Datepicker } from '../../../packages/index';

const currentDate = new Date(); // 测试当天为2018-11-23
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const today = currentDate.getDate();

describe('Datepicker', () => {
  it('type为“date”，上一年、上一月、', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    setTimeout(() => {
      expect(wrapper.find({ name: 't-date' }).isVisible()).to.equal(true);
      expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(year)).to.be.not.eql(-1);
      expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(month)).to.be.not.eql(-1);
      expect(wrapper.find('.t-date-picker-panel-content .today').text()).to.be.eql(`${today}`);
      const leftBtn = wrapper.findAll('.t-date-picker-panel .t-date-picker-panel-header__left-btn');
      const date = wrapper.findAll('.t-date-picker-panel-content .normal');
      // 选中本月第11天
      date.at(10).trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.currentValue).to.eql('2018-11-11');
        // 触发上一年
        leftBtn.at(0).trigger('click');
        setTimeout(() => {
          expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(year - 1)).to.be.not.eql(-1);
          // 触发上一月
          leftBtn.at(1).trigger('click');
          setTimeout(() => {
            expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(month - 1)).to.be.not.eql(-1);
            done();
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('type为“date”，下一年、下一月、', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    setTimeout(() => {
      const rightBtn = wrapper.findAll('.t-date-picker-panel .t-date-picker-panel-header__right-btn');
      rightBtn.at(0).trigger('click');
      setTimeout(() => {
        // 断言：2019年
        expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(year + 1)).to.be.not.eql(-1);
        // 点击下个月两次
        rightBtn.at(1).trigger('click');
        setTimeout(() => {
          rightBtn.at(1).trigger('click');
          setTimeout(() => {
            // 断言：为2020年1月
            expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(1)).to.be.not.eql(-1);
            expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(year + 2)).to.be.not.eql(-1);
            done();
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('点击显示的day，为上一个月份的panel则显示上一月份', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    setTimeout(() => {
      const prevMonth = wrapper.findAll('.t-date-picker-panel-content .prev-month');
      prevMonth.at(0).trigger('click');
      setTimeout(() => {
        expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(month - 1)).to.be.not.eql(-1);
        done();
      }, 10);
    }, 10);
  });
  it('点击显示的day，为下一个月份的panel则显示下一月份', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    setTimeout(() => {
      const nextMonth = wrapper.findAll('.t-date-picker-panel-content .next-month');
      nextMonth.at(0).trigger('click');
      setTimeout(() => {
        expect(wrapper.find('.t-date-picker-panel-header').text().indexOf(month + 1)).to.be.not.eql(-1);
        done();
      }, 10);
    }, 10);
  });
  it('【有问题】date格式化，根据输入显示', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '2018-11-20',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    expect(wrapper.vm.displayValue).to.eql('2018-11-20');
    const textInput = wrapper.find('.t-datepicker input[type="text"]');
    textInput.setValue('2018-11-10');
    setTimeout(() => {
      expect(wrapper.vm.userInput).to.eql('2018-11-10');
      wrapper.find('.t-datepicker input[type="text"]').trigger('keyup.enter');
      setTimeout(() => {
        expect(wrapper.vm.currentValue).to.eql('2018-11-10');
        expect(wrapper.emitted('input')[0]).to.eql(['2018-11-10']);
        done();
      }, 10);
      // console.log(wrapper.find('.t-datepicker input[type=text]').html())
    }, 10);
  });
  it('月', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
        format: 'yyyy年mm月',
        type: 'month',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    setTimeout(() => {
      const monthPanel = wrapper.findAll('.month-normal');
      expect(monthPanel.length).to.equal(12);
      expect(wrapper.find('.current-month').text()).to.eql('11月');
      monthPanel.at(1).trigger('click');
      setTimeout(() => {
        expect(wrapper.emitted('input')[0]).to.eql(['2018-02']);
        expect(wrapper.vm.currentValue).to.eql('2018-02-01');
        expect(wrapper.find('.current-month').text()).to.eql('02月');
        done();
      }, 10);
    }, 10);
  });
  it('年', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '2017',
        type: 'year',
        format: 'yyyy年',
      },
      sync: false,
    });
    wrapper.find('.t-input-wrapper').trigger('click');
    setTimeout(() => {
      expect(wrapper.find('.year-selected').text()).to.eql('2017');
      const yearWrapper = wrapper.findAll('.t-date-picker-panel-content>table td');
      expect(yearWrapper.length).to.equal(10);
      yearWrapper.at(4).trigger('click');
      setTimeout(() => {
        expect(wrapper.find('.year-selected').text()).to.eql('2014');
        expect(wrapper.emitted('input')[0]).to.eql(['2014']);
        expect(wrapper.vm.currentValue).to.eql('2014-10-01');
        done();
      }, 10);
    }, 10);
  });
  it('选择日期范围', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
        format: 'yyyy年mm月dd日',
        type: 'dateRange',
      },
      sync: false,
    });
    wrapper.find('.t-datepicker-header').trigger('click');
    wrapper.setProps({ value: '2018-11-03,2018-12-04' });
    setTimeout(() => {
      const headerText = wrapper.findAll('.t-datepicker-content-panel-header__text');
      expect(headerText.at(0).text()).to.eql('2018年');
      expect(headerText.at(1).text()).to.eql('11月');
      expect(headerText.at(2).text()).to.eql('2018年');
      expect(headerText.at(3).text()).to.eql('12月');
      expect(wrapper.find('.is-start').text()).to.eql('3');
      expect(wrapper.find('.is-end').text()).to.eql('4');
      expect(wrapper.findAll('.is-range').length).to.equal(32);
      const tdList = wrapper.findAll('.normal');
      tdList.at(4).trigger('click');
      setTimeout(() => {
        tdList.at(8).trigger('click');
        setTimeout(() => {
          expect(wrapper.emitted('input')[0]).to.eql(['2018年11月05日,2018年11月09日']);
          done();
        }, 10);
      }, 10);
    }, 10);
  });
  it('选择日期范围（同一天）', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
        format: 'yyyy年mm月dd日',
        type: 'dateRange',
      },
      sync: false,
    });
    wrapper.find('.t-datepicker-header').trigger('click');
    wrapper.setProps({ value: '2018-11-03,2018-12-04' });
    setTimeout(() => {
      const tdList = wrapper.findAll('.normal');
      tdList.at(4).trigger('click');
      setTimeout(() => {
        tdList.at(4).trigger('click');
        setTimeout(() => {
          expect(wrapper.emitted('input')[0]).to.eql(['2018年11月05日,2018年11月05日']);
          done();
        }, 10);
      }, 10);
    }, 10);
  });
  it('选择日期范围（先选本月再选上一个月）', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
        format: 'yyyy年mm月dd日',
        type: 'dateRange',
      },
      sync: false,
    });
    wrapper.find('.t-datepicker-header').trigger('click');
    setTimeout(() => {
      const tdList = wrapper.findAll('.normal');
      const prevList = wrapper.findAll('.prev-month');
      tdList.at(4).trigger('click');
      setTimeout(() => {
        prevList.at(0).trigger('click');
        setTimeout(() => {
          expect(wrapper.emitted('input')[0]).to.eql(['2018年10月28日,2018年11月05日']);
          done();
        }, 10);
      }, 10);
    }, 10);
  });
  it('选择日期范围（先选本月再选下一个月）', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
        format: 'yyyy年mm月dd日',
        type: 'dateRange',
      },
      sync: false,
    });
    wrapper.find('.t-datepicker-header').trigger('click');
    setTimeout(() => {
      const tdList = wrapper.findAll('.normal');
      const nextList = wrapper.findAll('.next-month');
      tdList.at(4).trigger('click');
      setTimeout(() => {
        nextList.at(10).trigger('click');
        setTimeout(() => {
          expect(wrapper.emitted('input')[0]).to.eql(['2018年11月05日,2019年01月03日']);
          done();
        }, 10);
      }, 10);
    }, 10);
  });
  it('选择日期范围,头部的四个上一年（月）下一年（月）按钮', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '',
        format: 'yyyy年mm月dd日',
        type: 'dateRange',
      },
      sync: false,
    });
    wrapper.find('.t-datepicker-header').trigger('click');
    setTimeout(() => {
      const leftBtn = wrapper.findAll('.is-left .t-datepicker-content-panel-header__icon-btn');
      const rightBtn = wrapper.findAll('.is-right .t-datepicker-content-panel-header__icon-btn');
      leftBtn.at(0).trigger('click');
      setTimeout(() => {
        const headerText = wrapper.findAll('.is-left .t-datepicker-content-panel-header__text');
        expect(headerText.at(0).text()).to.eql('2017年');
        rightBtn.at(2).trigger('click');
        setTimeout(() => {
          expect(wrapper.findAll('.is-right .t-datepicker-content-panel-header__text').at(0).text()).to.eql('2019年');
          leftBtn.at(1).trigger('click');
          setTimeout(() => {
            expect(headerText.at(1).text()).to.eql('10月');
            leftBtn.at(2).trigger('click');
            setTimeout(() => {
              expect(headerText.at(0).text()).to.eql('2018年');
              done();
            }, 10);
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('日期选择范围, 清空选择', (done) => {
    const wrapper = mount(Datepicker, {
      propsData: {
        value: '2018-11-03,2018-12-04',
        format: 'yyyy年mm月dd日',
        type: 'dateRange',
      },
      sync: false,
    });
    wrapper.find('.icon-error').trigger('click');
    setTimeout(() => {
      expect(wrapper.emitted('input')[0]).to.eql(['']);
      done();
    }, 10);
  });
});
