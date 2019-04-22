import { mount } from '@vue/test-utils';
import timepicker from '../../../packages/timePicker/index';

describe('timepicker', () => {
  it('测试timepicker正常渲染和工作', () => {
    const tpk = mount(timepicker, {
      propsData: {
        value: '00:00:00',
      },
    });
    const dom = tpk.element;
    // 整体是否正常渲染
    expect(tpk.contains('.t-timePicker-wrapper')).to.be.true;
    // 输入框是否正常渲染你
    expect(tpk.contains('.t-timePicker-input')).to.be.true;
    // 面板是否渲染并且隐藏
    expect(tpk.contains('.t-time-panel')).to.be.true;
    expect(dom.querySelector('.t-time-panel').style.display).to.be.equal('none');
    // 输入框是否正常显示
    expect(dom.querySelector('.t-timePicker-input').value).to.equal('00:00:00');
    // 点击输入框面板是否显示
    dom.querySelector('.t-timePicker-input').click();
    expect(dom.querySelector('.t-time-panel').style.display).not.to.be.equal('none');
    expect(dom.querySelectorAll('.t-time-spinner__item').length).to.equal(144);
    // 选择时间 12:30:59
    dom.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[12].click();
    dom.querySelectorAll('.t-time-spinner>div:nth-child(2) li')[30].click();
    dom.querySelectorAll('.t-time-spinner>div:nth-child(3) li')[59].click();
    expect(dom.querySelector('.t-timePicker-input').value).to.equal('12:30:59');
  });
  it('修改占位符和时间格式', () => {
    const tpk = mount(timepicker, {
      propsData: {
        value: '',
        format: 'hh.mm.ss',
        placeholder: '请挑选合适的时间',
      },
    });
    const dom = tpk.element;
    expect(dom.querySelector('.t-timePicker-input').value).to.equal('');
    expect(dom.querySelector('.t-timePicker-input').placeholder).to.equal('请挑选合适的时间');
    // 选择时间 17:45:21
    dom.querySelector('.t-timePicker-input').click();
    dom.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[17].click();
    dom.querySelectorAll('.t-time-spinner>div:nth-child(2) li')[45].click();
    dom.querySelectorAll('.t-time-spinner>div:nth-child(3) li')[21].click();
    expect(dom.querySelector('.t-timePicker-input').value).to.equal('17.45.21');
  });
  it('测试时间范围功能', (done) => {
    const tpk = mount(timepicker, {
      propsData: {
        value: '',
        range: '12:30:00-17:10:12',
      },
    });
    const dom = tpk.element;
    setTimeout(() =>{
      expect(dom.querySelectorAll('.t-time-spinner>div:nth-child(1) li').length).to.equal(6);
      dom.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[0].click();
      expect(dom.querySelectorAll('.t-time-spinner>div:nth-child(2) li').length).to.equal(30);
      dom.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[1].click();
      expect(dom.querySelectorAll('.t-time-spinner>div:nth-child(2) li').length).to.equal(60);
      dom.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[5].click();
      expect(dom.querySelectorAll('.t-time-spinner>div:nth-child(2) li').length).to.equal(11);
      dom.querySelectorAll('.t-time-spinner>div:nth-child(2) li')[9].click();
      expect(dom.querySelectorAll('.t-time-spinner>div:nth-child(3) li').length).to.equal(13);
      done();
    }, 20);
  });
  it('测试选取时间段功能', (done) => {
    const tpk = mount(timepicker, {
      propsData: {
        value: '',
        isPeriod: true,
      },
    });
    const dom = tpk.element;
    setTimeout(() => {
      expect(dom.querySelectorAll('.t-timePicker-wrapper').length).to.equal(2);
      const start = dom.querySelectorAll('.t-timePicker-wrapper')[0];
      const end = dom.querySelectorAll('.t-timePicker-wrapper')[1];
      start.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[5].click();
      start.querySelectorAll('.t-time-spinner>div:nth-child(2) li')[31].click();
      start.querySelectorAll('.t-time-spinner>div:nth-child(3) li')[54].click();
      start.querySelector('.t-time-panel__btn.confirm').click();
      expect(tpk.vm.starttime).to.equal('05:31:54');
      end.querySelectorAll('.t-time-spinner>div:nth-child(1) li')[13].click();
      end.querySelectorAll('.t-time-spinner>div:nth-child(2) li')[42].click();
      end.querySelectorAll('.t-time-spinner>div:nth-child(3) li')[14].click();
      end.querySelector('.t-time-panel__btn.confirm').click();
      expect(tpk.vm.endtime).to.equal('13:42:14');
      setTimeout(() => {
        expect(tpk.emitted('input')[0][0]).to.equal('05:31:54-13:42:14');
        done();
      }, 20);
    }, 20);
  });
});
