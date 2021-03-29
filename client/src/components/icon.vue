<template>
    <div class="icon-block" v-html="require('!!html-loader!./../assets/' + this.name + '.svg')" aria-hidden="true"></div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'icon',
})
export default class Icon extends Vue {
    @Prop()
    public readonly name!: string;
}

</script>

<style module>

.icon-block svg {
    fill: var(--base-icon-color);
    vertical-align: middle;

    width: 100%;
    height: 100%;
}

</style>

<style lang="scss">

.icon-block {
    display: inline-block;

    svg {
        fill: var(--base-icon-color);
    }
}

</style>