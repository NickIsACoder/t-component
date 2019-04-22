import Vue from 'vue/dist/vue';
import { Cascader } from '../../../packages/index';


describe('Cascader', () => {
  const CascaderData = [
    {
      value: 'gd',
      label: '广东省',
      children: [
        {
          value: 'gz',
          label: '广州市',
          children: [
            {
              value: 'th',
              label: '天河区',
            },
            {
              value: 'yx',
              label: '越秀区',
            },
            {
              value: 'lw',
              label: '荔湾区',
            },
            {
              value: 'py',
              label: '番禺区',
            },
          ],
        },
        {
          value: 'cz',
          label: '潮州市',
          loading: false,
        },
        {
          value: 'sz',
          label: '深圳市',
          loading: false,
        },
      ],
    },
    {
      value: 'fj',
      label: '福建省',
      children: [
        {
          value: 'fz',
          label: '福州市',
        },
        {
          value: 'xm',
          label: '厦门市',
        },
      ],
    },
  ];
  beforeEach(() => {
    const el = document.querySelector('#test');
    if (!el) {
      const elm = document.createElement('div');
      elm.id = 'test';
      document.body.appendChild(elm);
    }
  });
  afterEach(() => {
    const el = document.querySelector('.t-cascader');
    if (!el) return;

    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    if (el.__vue__) {
      el.__vue__.$destroy();
    }
  });
  it('Cascader正确渲染', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 500);
    }, 10);
  });
  it('Cascader测试单选功能', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" :displayMethod="displayCas" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
      methods: {
        displayCas(value) {
          let display = '';
          value.forEach((x) => {
            display += `${x.label}-`;
          });
          return display;
        },
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        // 点击一层选中
        window.document.querySelectorAll('.t-cascader-wrapper ul li')[0].click();
        setTimeout(() => {
          expect(window.document.querySelectorAll('.is-select').length).to.be.equal(1);
          expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(2);
          // 点击第二层选中
          window.document.querySelectorAll('.t-cascader-wrapper')[1].querySelectorAll('ul li')[0].click();
          setTimeout(() => {
            expect(window.document.querySelectorAll('.is-select').length).to.be.equal(2);
            expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(3);
            // 点击第三层选中
            window.document.querySelectorAll('.t-cascader-wrapper')[2].querySelectorAll('ul li')[0].click();
            setTimeout(() => {
              expect(window.document.querySelectorAll('.is-select').length).to.be.equal(3);
              expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(3);
              // 断言:input值正确显示
              expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省-广州市-天河区-');
              // 断言:删除按钮显示
              expect(window.document.querySelector('.t-cascader-header .icon-error')).to.not.be.empty;
              // 断言:dropdown隐藏
              // expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.be.equal('none');
              // 点击删除按钮清除
              window.document.querySelector('.t-cascader-header .icon-error').click();
              setTimeout(() => {
                // 断言:input值清空
                expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('');
                wrapper.$destroy && wrapper.$destroy();
                wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
                done();
              }, 10);
            }, 10);
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('Cascader测试多选功能', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" multiple :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        // 点击一层选中
        window.document.querySelectorAll('.t-cascader-wrapper ul li')[0].click();
        setTimeout(() => {
          expect(window.document.querySelectorAll('.is-select').length).to.be.equal(1);
          expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(2);
          // 点击第二层选中
          window.document.querySelectorAll('.t-cascader-wrapper')[1].querySelectorAll('ul li')[0].click();
          setTimeout(() => {
            expect(window.document.querySelectorAll('.is-select').length).to.be.equal(2);
            expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(3);
            // 点击第三层选中两个
            window.document.querySelectorAll('.t-cascader-wrapper')[2].querySelectorAll('ul li')[1].click();
            window.document.querySelectorAll('.t-cascader-wrapper')[2].querySelectorAll('ul li')[3].click();
            setTimeout(() => {
              // 断言:确定按钮显示
              expect(window.document.querySelectorAll('.t-cascader-wrapper')[2].querySelector('button span').innerHTML).to.be.equal('确定');
              expect(window.document.querySelectorAll('.is-select').length).to.be.equal(4);
              // 点击确定按钮
              window.document.querySelectorAll('.t-cascader-wrapper')[2].querySelector('button').click();
              setTimeout(() => {
                // // 断言:input值正确显示
                expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省/广州市/越秀区,番禺区,');
                // 断言:dropdown隐藏
                // expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.be.equal('none');
                wrapper.$destroy && wrapper.$destroy();
                wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
                done();
              }, 10);
            }, 10);
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('Cascader禁止选择', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" disable :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 10);
    }, 10);
  });
  it('Cascader下拉框位置bottomRight', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        expect(window.document.querySelector('.t-cascader-dropdown').style.right).to.not.be.equal('0px');
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 10);
    }, 10);
  });
  it('Cascader下拉框位置topLeft', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        expect(window.document.querySelector('.t-cascader-dropdown').style.top).to.not.be.equal('0px');
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 10);
    }, 10);
  });
  it('Cascader下拉框位置topRight', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道"  :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        expect(window.document.querySelector('.t-cascader-dropdown').style.top).to.not.be.equal('-190px');
        expect(window.document.querySelector('.t-cascader-dropdown').style.right).to.not.be.equal('0px');
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 10);
    }, 10);
  });
  it('Cascader加载单选回选数据', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" :options="casOptions" :value="casValue"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
          casValue: [
            {
              value: 'gd',
              label: '广东省',
            }, {
              value: 'gz',
              label: '广州市',
            }, {
              value: 'xy',
              label: '越秀区' },
          ],
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // // 断言:input值正确显示
      expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省/广州市/越秀区');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelectorAll('.is-select').length).to.be.equal(2);
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 10);
    }, 10);
  });
  it('Cascader加载多选回选数据', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" multiple :options="casOptions" :value="casValue"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
          casValue: [
            {
              value: 'gd',
              label: '广东省',
            }, {
              value: 'gz',
              label: '广州市',
            }, [{
              value: 'yx',
              label: '越秀区',
            },
            {
              value: 'lw',
              label: '荔湾区',
            }],
          ],
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // // 断言:input值正确显示
      expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省/广州市/越秀区,荔湾区,');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelectorAll('.is-select').length).to.be.equal(4);
        wrapper.$destroy && wrapper.$destroy();
        wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
        done();
      }, 10);
    }, 10);
  });
  it('Cascader可以选中一个值传到model', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道" :anyState=true :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: CascaderData,
        };
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 断言:数据正常传入渲染
      expect(wrapper.casOptions).to.be.equal(CascaderData);
      // 断言:placeholder
      expect(window.document.querySelector('.t-cascader-placeholder').innerHTML).to.be.equal('请选择省市区街道');
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        // 点击一层选中
        window.document.querySelectorAll('.t-cascader-wrapper ul li')[0].click();
        setTimeout(() => {
          expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省');
          expect(window.document.querySelectorAll('.is-select').length).to.be.equal(1);
          expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(2);
          // 点击第二层选中
          window.document.querySelectorAll('.t-cascader-wrapper')[1].querySelectorAll('ul li')[0].click();
          setTimeout(() => {
            expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省/广州市');
            expect(window.document.querySelectorAll('.is-select').length).to.be.equal(2);
            expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(3);
            // 点击第三层选中
            window.document.querySelectorAll('.t-cascader-wrapper')[2].querySelectorAll('ul li')[0].click();
            setTimeout(() => {
              expect(window.document.querySelectorAll('.is-select').length).to.be.equal(3);
              expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(3);
              // 断言:input值正确显示
              expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('广东省/广州市/天河区');
              // 断言:删除按钮显示
              expect(window.document.querySelector('.t-cascader-header .icon-error')).to.not.be.empty;
              // 断言:dropdown隐藏
              // expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.be.equal('none');
              // 点击删除按钮清除
              window.document.querySelector('.t-cascader-header .icon-error').click();
              setTimeout(() => {
                // 断言:input值清空
                expect(window.document.querySelector('.t-cascader-header span').innerHTML).to.be.equal('请选择省市区街道');
                wrapper.$destroy && wrapper.$destroy();
                wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
                done();
              }, 10);
            }, 10);
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('Cascader异步渲染(有子节点)', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道 " :loadData="loadData" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: [
            {
              value: 'gd',
              label: '广东省',
              loading: false,
            }],
        };
      },
      methods: {
        loadData(item, callback) {
          const data = item;
          data.loading = true;
          data.children = [
            {
              value: 'th',
              label: '天河区',
            },
            {
              value: 'xy',
              label: '越秀区',
            },
          ];
          data.loading = false;
          callback();
        },
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        // 点击一层选中
        window.document.querySelectorAll('.t-cascader-wrapper ul li')[0].click();
        setTimeout(() => {
          expect(window.document.querySelectorAll('.is-select').length).to.be.equal(1);
          expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(2);
          expect(window.document.querySelectorAll('.t-cascader-wrapper')[1].querySelectorAll('.t-cascader-wrapper-item').length).to.be.equal(2);
          wrapper.$destroy && wrapper.$destroy();
          wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
          done();
        }, 700);
      }, 10);
    }, 10);
  });
  it('Cascader异步渲染(没有子节点)', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道 " :loadData="loadData" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: [
            {
              value: 'gd',
              label: '广东省',
              loading: false,
            }],
        };
      },
      methods: {
        loadData(item, callback) {
          const data = item;
          data.loading = true;
          data.children = [];
          data.loading = false;
          callback();
        },
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        // 点击一层选中
        window.document.querySelectorAll('.t-cascader-wrapper ul li')[0].click();
        setTimeout(() => {
          expect(window.document.querySelectorAll('.is-select').length).to.be.equal(1);
          // 断言:只有一层
          expect(window.document.querySelectorAll('.t-cascader-wrapper').length).to.be.equal(1);
          wrapper.$destroy && wrapper.$destroy();
          wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
          done();
        }, 500);
      }, 10);
    }, 10);
  });
  it('Cascaderde chose方法', (done) => {
    const Constructor = Vue.extend({
      template: '<Cascader style="width: 300px;" placeholder="请选择省市区街道 " @choose="choose" :options="casOptions"></Cascader>',
      components: { Cascader },
      data() {
        return {
          casOptions: [
            {
              value: 'gd',
              label: '广东省',
              children: [
                {
                  value: 'gz',
                  label: '广州市',
                }
              ]
            }],
          select: [],
        };
      },
      methods: {
        choose(val) {
          this.select = val;
        },
      },
    });
    const wrapper = new Constructor().$mount('#test');
    setTimeout(() => {
      // 断言:Cascader正常渲染
      expect(window.document.querySelector('.t-cascader')).to.not.be.empty;
      // 点击弹出dropdown
      window.document.querySelector('.t-cascader-header').click();
      setTimeout(() => {
        // 断言:dropdown正确显示
        expect(window.document.querySelector('.t-cascader-dropdown').style.display).to.not.be.equal('none');
        // 点击一层选中
        const items = wrapper.$el.querySelectorAll('.t-cascader-wrapper-item');
        items[0].click();
        setTimeout(() => {
          wrapper.$el.querySelectorAll('.t-cascader-wrapper-item')[1].click();
          // 断言:choose方法被触发
          setTimeout(() => {
            expect(wrapper.select).to.be.eql([{ value: 'gd', label: '广东省' }]);
            expect(window.document.querySelectorAll('.is-select').length).to.be.equal(2);
            wrapper.$destroy && wrapper.$destroy();
            wrapper.$el && wrapper.$el.parentNode && wrapper.$el.parentNode.removeChild(wrapper.$el);
            done();
          }, 10);
        }, 500);
      }, 10);
    }, 10);
  });
});
