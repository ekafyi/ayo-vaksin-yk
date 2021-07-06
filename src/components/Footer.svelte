<footer class="mt-8 text-center">
	<ul class="footer-links py-4 mb-2 text-sm text-gray-500">
		<li><a class="footer-link" href="/about">Tentang</a></li>
		<li>
			<a class="footer-link" href="https://www.dinkes.jogjaprov.go.id/" rel="external">
				Dinkes Prov DIY
			</a>
		</li>
		<li>
			<a class="footer-link" href="tel:119">119</a> (hotline)
		</li>
	</ul>
	<p class="credit text-gray-500 border-t py-4">
		&copy; 2021 Eka - <a
			class="font-medium underline hover:text-black focus:text-black"
			href="https://github.com/ekafyi/ayo-vaksin-yk"
			rel="external">github.com/ekafyi</a
		>
		☕️
	</p>
</footer>

<style lang="postcss">
	.credit {
		font-size: 0.625rem;
	}
	.footer-link {
		@apply font-medium text-black underline;
	}
	.footer-links li {
		display: inline-block;
	}
	.footer-links li:not(:last-child)::after {
		@apply px-0.5;
		content: " · ";
	}
	footer::before {
		@apply border-t inline-block w-12 h-0.5;
		content: "";
	}
</style>
