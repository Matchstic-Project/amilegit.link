<template>
	<div class="input-outer">
        <div class="input-region">
            <label for="main-input" id="main-input-label">Specify link to make it look suspect</label>
            <input
                v-model="input"
                placeholder="Specify link to make it look suspect"
                @keyup.enter="onButtonGo"
                id="main-input"
                tabindex="0"
                autocomplete="url"
                type="url"
                aria-labelledby="main-input-label" />

            <button @click="onButtonGo" :class="{ disabled: input.length === 0 }" aria-label="Generate" tabindex="0">
                <icon name="nav" v-if="!loading" />
                <vue-loaders-line-scale-party class="loader" scale="0.6" v-else />
            </button>
        </div>

        <div class="error" v-if="error.length > 0">
            <p>{{ error }}</p>
            <p>Expected format: <i>https://example.com</i></p>
        </div>

        <!-- Render latest entry -->
        <div class="success" v-if="latestEntry">
            <h4>Created URL</h4>
            <a class="generated-url" :href="link">{{ link }}</a>
            <p>Click here to <a @click="copy">copy it to clipboard</a></p>
        </div>
	</div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { CreatedExpansion } from '@/lib/types';

import Icon from '@/components/icon.vue';

@Component({
    name: 'input-region',
    components: {
        'icon': Icon
    }
})
export default class InputRegion extends Vue {
	private input = '';
    private error = '';
    private loading = false;

    private latestEntry: CreatedExpansion | null = null;

    private get link() {
        if (this.latestEntry)
            return this.latestEntry.url;

        return '';
    }

	private async onButtonGo() {
		try {
            const url = this.input.startsWith('http') ? this.input : 'http://' + this.input;

            this.loading = true;
			const newEntry = await this.$api.createEntry(url);
			Vue.set(this, 'latestEntry', newEntry);

			this.input = '';
            this.error = '';
            this.loading = false;
		} catch (e) {
			console.error('Failed to create, ' + e);

			// 400 -> not a valid URL
			if (e === 400) {
				this.error = 'This is not a valid URL, please enter something else.';
			} else if (e === 429) {
                this.error = 'You\'ve tried this too many times! Please come back later.';
            } else {
				this.error = 'Failed to create shortened URL (code ' + e + ').';
			}
		}
    }

    private copy() {
        if (this.latestEntry) this.copyToClipboard(this.latestEntry.url);
    }

    private copyToClipboard(text: string): void {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
}

</script>

<style scoped lang="scss">

.input-region {
	width: 100%;
	display: flex;
	flex-direction: row;
    padding: var(--padding-v-large) 0;

    label {
        display: none;
    }

	input {
		flex: 1;
		margin-right: var(--padding-h);
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-block {
            height: var(--font-size-h4);
            width: var(--font-size-h4);
        }

        .loader {
            height: var(--font-size-h4);
            position: relative;
            top: -5px;

            opacity: 0.5;
        }
    }
}

.error p {
	color: var(--error-color);
}

.success {
    border-radius: var(--border-radius);
    background: var(--card-color);

    padding: var(--padding-v) var(--padding-h);

    margin-bottom: var(--padding-v-large);
    margin-top: var(--padding-v);

    h4 {
        font-weight: bold;
        margin-bottom: var(--padding-v);
    }

    .generated-url {
        word-break: break-all;
        display: block;
        color: var(--app-color);
        font-weight: bold;

        text-decoration: none;
        margin-bottom: var(--padding-v);

        &:hover {
            opacity: 0.75;
        }
    }

    p {
        opacity: 0.5;
    }
}

@media only screen and (max-width: 400px) {
    .input-region {
        flex-direction: column;

        input {
            margin-right: 0;
            margin-bottom: var(--padding-v);
        }
    }
}

</style>
