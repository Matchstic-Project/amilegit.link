import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';

// @ts-ignore
import InputRegion from '../input-region.vue';

describe('<input-region />', () => {

    const url = 'https://abc.def.xyz/123';
    const expansion = 'https://test.com';

    it('Renders without having an existential crisis', () => {
        const wrapper = shallowMount(InputRegion);
        expect(wrapper.text()).toContain('Specify link to make it look suspect');
    });

    it('Creates and displays new expansion', async () => {
        const wrapper = shallowMount(InputRegion);

        (wrapper.vm.$api as any) = {
            createEntry: jest.fn().mockImplementation(() => {
                return {
                    url,
                    expansion
                }
            })
        };

        (wrapper.vm as any).input = url;

        const button = wrapper.find('button');
        await button.trigger('click');
        await Vue.nextTick();

        expect(wrapper.text()).toContain(url);
    });

    it('Shows error if creation failed', async () => {
        const wrapper = shallowMount(InputRegion);

        (wrapper.vm.$api as any) = {
            createEntry: jest.fn().mockImplementation(() => {
                throw 400;
            })
        };

        (wrapper.vm as any).input = url;

        const button = wrapper.find('button');
        await button.trigger('click');
        await Vue.nextTick();

        expect(wrapper.text()).not.toContain(url);
        expect(wrapper.text()).toContain('This is not a valid URL, please enter something else');
    })
});