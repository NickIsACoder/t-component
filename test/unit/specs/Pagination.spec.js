import { mount } from '@vue/test-utils';
import { Pagination } from '../../../packages/index';

describe('Pagination', () => {
  // let vm;
  // afterEach(() => {
  //   const el = document.querySelector('.t-loading');
  //   if (!el) return;

  //   if (el.parentNode) {
  //     el.parentNode.removeChild(el);
  //   }
  //   if (el.__vue__) {
  //     el.__vue__.$destroy();
  //   }
  // });
  it('测试pagination配置', () => {
    const wrapper = mount(Pagination, {
      propsData: {
        total: 600,
        currentPage: 2,
        pageSize: 15,
        showPageSize: true,
        showTotal: true,
        showElevator: true,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:pagination正常显示
    expect(wrapper.find('.t-pagination').exists()).to.be.equal(true);
    const pageItem = wrapper.find('.t-pagination ul');
    //  断言:总条数的显示
    expect(pageItem.find('span').text()).to.be.equal('共600条');
    //  断言:当前选中页码
    expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('2');
    //  断言:每页显示条数
    expect(pageItem.find('.t-pagination-select-wrapper').text()).to.be.include('15条');
    //  断言:显示跳转选项
    expect(pageItem.find('.t-pagination-go').exists()).to.be.eql(true);
  });
  it('测试pagination点击上一页切换页码', () => {
    const wrapper = mount(Pagination, {
      propsData: {
        total: 100,
        currentPage: 2,
        pageSize: 15,
        showPageSize: true,
        showTotal: true,
        showElevator: true,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:pagination正常显示
    expect(wrapper.find('.t-pagination').exists()).to.be.equal(true);
    const pageItem = wrapper.find('.t-pagination ul');
    //  断言:总条数的显示
    expect(pageItem.find('span').text()).to.be.equal('共100条');
    //  断言:当前选中页码
    expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('2');
    //  断言:每页显示条数
    expect(pageItem.find('.t-pagination-select-wrapper').text()).to.be.include('15条');
    //  断言:显示跳转选项
    expect(pageItem.find('.t-pagination-go').exists()).to.be.eql(true);
    // 点击上一页
    pageItem.findAll('li').at(1).trigger('click');
    //  断言:当前选中页码
    expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('1');
    // 点击上一页
    pageItem.findAll('li').at(1).trigger('click');
    //  断言:当页码为1是,上一页不可点击
    expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('1');
    expect(pageItem.contains('.is-disabled')).to.be.equal(true);
    expect(wrapper.emitted().pageChange).to.be.exist;
  });
  it('测试pagination点击下一页切换页码', () => {
    const wrapper = mount(Pagination, {
      propsData: {
        total: 100,
        currentPage: 9,
        pageSize: 10,
        showPageSize: true,
        showTotal: true,
        showElevator: true,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:pagination正常显示
    expect(wrapper.find('.t-pagination').exists()).to.be.equal(true);
    const pageItem = wrapper.find('.t-pagination ul');
    //  断言:总条数的显示
    expect(pageItem.find('span').text()).to.be.equal('共100条');
    //  断言:当前选中页码
    expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('9');
    //  断言:每页显示条数
    expect(pageItem.find('.t-pagination-select-wrapper').text()).to.be.include('10条');
    //  断言:显示跳转选项
    expect(pageItem.find('.t-pagination-go').exists()).to.be.eql(true);
    // 点击下一页
    pageItem.findAll('.t-pagination-item').at(pageItem.findAll('.t-pagination-item').length - 1).trigger('click');
    //  断言:当前选中页码
    expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('10');
    //  断言:当页码为10页,下一页不可点击
    expect(pageItem.contains('.is-disabled')).to.be.equal(true);
    expect(wrapper.emitted().pageChange).to.be.exist;
  });
  it('测试pagination修改每页条目数', (done) => {
    const wrapper = mount(Pagination, {
      propsData: {
        total: 100,
        currentPage: 9,
        pageSize: 10,
        showPageSize: true,
        showTotal: true,
        showElevator: true,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:pagination正常显示
    expect(wrapper.find('.t-pagination').exists()).to.be.equal(true);
    const pageItem = wrapper.find('.t-pagination ul');
    // 断言:未点击前,dropdown未显示
    expect(pageItem.find('.t-pagination-select-dropdown').isVisible()).to.be.eql(false);
    // 点击更改每页条数选项,选择20/条
    pageItem.find('.t-pagination-select').trigger('click');
    setTimeout(() => {
      // 断言: dropdown正确显示
      expect(pageItem.find('.t-pagination-select-wrapper').isVisible()).to.be.equal(true);
      // 选择20/条
      pageItem.findAll('.t-pagination-select-dropdown-li').at(1).trigger('click');
      // 断言:选中20条
      expect(pageItem.find('.t-pagination-select-dropdown-li-active').text()).to.be.include('20条');
      // 断言:sizeChange被触发
      expect(wrapper.emitted().sizeChange).to.be.exist;
      done();
    }, 500);
  });
  it('测试pagination点击跳转选项跳转', (done) => {
    const wrapper = mount(Pagination, {
      propsData: {
        total: 100,
        currentPage: 9,
        pageSize: 10,
        showPageSize: true,
        showTotal: true,
        showElevator: true,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:pagination正常显示
    expect(wrapper.find('.t-pagination').exists()).to.be.equal(true);
    const pageItem = wrapper.find('.t-pagination ul');
    // 设置跳转的页码为3.并且回车跳转
    wrapper.find('.t-pagination-go input[type="text"]').setValue('3');
    wrapper.find('.t-pagination-go input[type="text"]').trigger('keyup.enter');
    setTimeout(() => {
      //  断言:当前选中页码
      expect(pageItem.find('.t-pagination-item-active').text()).to.be.equal('3');
      expect(wrapper.emitted().pageChange).to.be.exist;
      done();
    }, 10);
  });
});
