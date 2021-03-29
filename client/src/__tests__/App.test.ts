import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';

// @ts-ignore
import App from '../App.vue';

jest.useFakeTimers();

describe('<App />', () => {

    it('Renders without having an existential crisis', () => {
        const wrapper = shallowMount(App);
        expect(wrapper.text()).toContain('Prank your co-workers. Confuse your parents.');
    });

    it('Displays correct taglines', async () => {
        const wrapper = shallowMount(App);

        (wrapper.vm as any).chosenTagline = 2;
        await Vue.nextTick();
        expect(wrapper.text()).toContain('Perfect for undoing years of user training!');

        (wrapper.vm as any).chosenTagline = 4;
        await Vue.nextTick();
        expect(wrapper.text()).toContain('Not approved by your ISP');
    });

    it('Cycles through taglines', async () => {
        shallowMount(App);
        expect(setInterval).toHaveBeenCalled();
    });

});