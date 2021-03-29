<template>
	<div id="app">
		<div class="background-gradient" />

		<main class="content">
			<div class="content-header">
				<img src="./assets/virus.png" aria-hidden="true" alt="logo" width="50" height="50" />

				<div>
					<div class="title">
						<h1>Am I Legit?</h1><h4 aria-hidden="true">.link</h4>
					</div>

					<transition name="transition-fade">
						<p class="subtitle">{{ tagline }}</p>
					</transition>
				</div>
			</div>

			<div class="top-info">
				<p class="bright content-title">Prank your co-workers. Confuse your parents.</p>
				<p>Turn any link into something that looks like it takes you to a deep, dark corner of the web!</p>
			</div>

			<input-region />

			<div class="adwrapper">
				<div class="donation top">
					<p class="content-title">Hate ads?</p>
					<p class="donation-subtitle">That makes two of us...</p>
				</div>

				<div class="donation bottom">
					<p>Please consider donating if you liked this:</p>
					<div class="approaches">
						<a href="https://paypal.me/mclarke0805" tabindex="0">
							<img src="./assets/paypal.png" aria-label="PayPal" height="22" width="22" />
						</a>
						<a @click.prevent.stop="onCryptoClick(0)" tabindex="0">
							<img src="./assets/bitcoin.png" aria-label="Bitcoin" height="22" width="22" />
						</a>
						<a @click.prevent.stop="onCryptoClick(1)" tabindex="0">
							<img src="./assets/eth.png" aria-label="Ethereum" height="22" width="22" />
						</a>
					</div>

					<p class="crypto" v-if="cryptoMode !== -1"><span>{{ cryptoMode === 0 ? 'Bitcoin: ' : 'Ethereum: '}}</span>{{ cryptoAddress}}</p>
					<p class="crypto-copy" v-if="cryptoMode !== -1"><a @click="copyCrypto">Copy to clipboard</a></p>
				</div>
			</div>

			<div class="description">
				<p class="content-title">How does it work?</p>
				<p>The link that gets generated will just take you to the original one.</p>
				<br />
				<p>For example,</p>

				<code class="display-code">
					<a href="https://twitter.com">
					https://twitter.com
					</a>
				</code>

				<p>is transformed into:</p>

				<code class="display-code">
					<a href="https://xtreme-dl.xyz/hacked/a9b4bb7e3c/79bab65f8/039c/uninstall.exe.doc.swf">
					https://xtreme-dl.xyz/hacked/a9b4bb7e3c/79bab65f8/039c/uninstall.exe.doc.swf
					</a>
				</code>

				<p>Yet, if you click that, you'll be taken to <code>twitter.com</code>!</p>
				<br />
				<br />

				<p class="content-title">Why do the links look like that?</p>
				<p>The content used to generate links is inspired by various places:</p>
				<ul>
					<li><p>Insecure configs like <code>/wp-admin/*</code> being left publicly readable</p></li>
					<li><p>Common filenames used by malware</p></li>
					<li><p>Crowd-sourcing of bad sounding filenames</p></li>
				</ul>

				<p>Suggestions to improve content are welcome!</p>
				<br />
			</div>

			<div class="footer">
				<p>Lovingly shoved together in a few hours</p>
				<a href="https://twitter.com/_Matchstic">© Matt Clarke</a>
			</div>
		</main>
	</div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import InputRegion from '@/components/input-region.vue';


@Component({
	components: {
		'input-region': InputRegion,
	}
})
export default class App extends Vue {

	private cryptoMode = -1;

	private chosenTagline = 0;
	created() {
		this.chosenTagline = this.getRandomInt(this.taglines.length);

		setInterval(() => {
			this.chosenTagline = this.getRandomInt(this.taglines.length);
		}, 60 * 1000);
	}

	private getRandomInt(max: number): number {
		return Math.floor(Math.random() * Math.floor(max));
	}

	private taglines: string[] = [
		'Sysadmins hate this one weird trick!',
		'You should block this on your network!',
		'Perfect for undoing years of user training!',
		'Yet more domains to add to the email filter!',
		'Not approved by your ISP',
		'Click this link for a free coffee',
		'Would you like malware with that?',
		'Is your fridge still online?',
		'Risky click of the day'
	];

	get tagline() {
		return this.taglines[this.chosenTagline];
	}

	onCryptoClick(mode: number) {
		this.cryptoMode = mode;
	}

	copyCrypto() {
		const el = document.createElement('textarea');
        el.value = this.cryptoAddress;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
	}

	get cryptoAddress(): string {
		return this.cryptoMode === 0 ? 'bc1qstlxmkhep037w8cpsqmmks0qh0zmwwhnxgstx3' : '0xEfEC3E45F5Ae04b7Caf0937086C88dc94c078307';
	}

}
</script>

<style lang="scss">

@import 'reset-css';
@import './style/main.scss';

#app {
	color: var(--text-color);
	position: relative;
	margin: 0;
	padding: 0;
	width: 100%;
	min-height: 100vh;

	overflow: hidden;

	.content {
		width: 100%;

		--width: min(calc(100% - calc(var(--content-inset) * 2)), 800px);
		--inset: calc(calc(100% - var(--width)) / 2);

		padding: calc(var(--padding-v-large) * 2) var(--inset) 0 var(--inset);

		position: relative;

		display: flex;
		flex-direction: column;
	}

	.input-outer {
		margin: var(--padding-v-large) 0;
	}
}

.background-gradient {
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 0;

	position: absolute;
	height: 100%;
	width: 100%;
}

.background-gradient {
	background: #F3904F;  /* fallback for old browsers */
	background: -webkit-linear-gradient(to top, #3B4371, #F3904F);  /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to top, #3B4371, #F3904F); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	filter: brightness(0.5);
}

.card {
	background: var(--card-color);
	border-radius: var(--border-radius);
	overflow: hidden;
	padding: var(--padding-v) var(--padding-h);
	position: relative;

	margin-bottom: var(--padding-v-large);
	width: fit-content;
	max-width: 100%;

	-webkit-box-shadow: 0px 10px 20px -8px var(--shadow-color);
	-moz-box-shadow: 0px 10px 20px -8px var(--shadow-color);
	box-shadow: 0px 10px 20px -8px var(--shadow-color);

	i {
		margin-right: var(--padding-h);
	}
}

.transition-fade-enter-active, .transition-fade-leave-active {
	transition: opacity 0.5s;
}
.transition-fade-enter, .transition-fade-leave-to {
	opacity: 0;
}

.content-header {
	display: flex;
	align-items: center;

	img {
		height: 50px;
		width: 50px;
		margin-right: var(--padding-h-large);
	}
}

.title {
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	font-family: 'Source Code Pro', monospace;

	h4 {
		margin-bottom: 3px;
		margin-left: calc(var(--padding-h-small) / 2);
		font-weight: bold;
		color: var(--faded-text-color);
	}
}

.subtitle {
	font-style: italic;
}

.content-title {
	font-size: var(--font-size-h4);
	font-size: var(--font-size-h4);
	color: var(--text-color);
}

.top-info {
	margin-top: calc(var(--padding-v-large) + var(--padding-v));
}

.adwrapper {
	position: relative;
	width: 100%;
	max-width: 100%;

	overflow: hidden;

	background: var(--card-color);
	border-radius: var(--border-radius);
	margin-bottom: calc(var(--padding-v-large) + var(--padding-v));

	.adblock {
		top: 0;
		left: 0;

		position: absolute;
		height: 100px !important;
		width: 100%;
		overflow: hidden;

		background: var(--item-text-color);
	}

	.donation {
		width: 100%;
		padding: var(--padding-v) var(--padding-h);

		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		&.top {
			height: 100px;
		}

		a {
			margin-top: var(--padding-v-small);
			margin-right: var(--padding-h);
		}

		.approaches {
			display: flex;
		}

		img {
			height: 22px;
			background: var(--text-color);
			padding: 2px;
			border-radius: 3px;
		}

		.donation-subtitle {
			margin-bottom: var(--padding-v-large);
		}

		.crypto {
			margin-top: var(--padding-v-small);

			span {
				opacity: 0.5;
			}

			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: normal;
		}
	}
}

.description {
	margin-bottom: calc(var(--padding-v-large) + var(--padding-v));

	ul {
		margin: var(--padding-v) 0;
		list-style: unset;

		code {
			display: inline-block;
			margin: 0;
		}

		li {
			margin-left: var(--font-size-p);
			padding-left: var(--padding-h-small);
		}
	}

	.display-code {
		display: block;
		width: 100%;
		padding: var(--padding-v) var(--padding-h);
		text-align: center;
		margin: var(--padding-v) 0;
	}

	p code {
		width: fit-content;
		display: inline-block;
	}
}

.footer {
	opacity: 0.65;

	p {
		margin-bottom: var(--padding-v-small);
	}

	margin-bottom: var(--padding-v-large);
	margin-bottom: calc(var(--padding-v-large) + constant(safe-area-inset-bottom));
    margin-bottom: calc(var(--padding-v-large) + env(safe-area-inset-bottom));
}

// content-header on mobile widths

@media only screen and (max-width: 450px) {
    .content-header {
		flex-direction: column;

		img {
			margin-right: 0;
			margin-bottom: var(--padding-v-large);
		}
    }
}

</style>
