import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="infinite-scroll"
export default class extends Controller {
	static values = {
		url: String,
		page: Number,
	};

	connect() {
		this.pageValue = this.pageValue || 1;
	}

	scroll(event) {
		if (this.isScrolledToBottom(event)) {
			this.loadNextPage();
		}
	}

	isScrolledToBottom(event) {
		const { scrollTop, scrollHeight, clientHeight } = event.target;
		return scrollHeight - scrollTop === clientHeight;
	}

	async loadNextPage() {
		const url = new URL(this.urlValue);
		url.searchParams.set("page", this.pageValue);

		const response = await get(url.toString(), {
			headers: { "Turbo-Stream": "true" },
		});

		if (response.ok) {
			const turboStream = await response.text();
			const div = document.createElement("div");
			div.innerHTML = turboStream;
			document.body.appendChild(div.firstChild);
			this.pageValue += 1;
		}
	}
}

// loadPosts(event) {
// 	event.preventDefault();
//
// 	fetch(`${window.location.pathname}/load_posts?page=${this.page}`)
// 		.then((response) => response.text())
// 		.then((html) => {
// 			this.postsContainerTarget.insertAdjacentHTML("beforeend", html);
// 			this.page += 1;
// 		});
// }

// static targets = ["postsContainer"];
//
// connect() {
// 	window.addEventListener("scroll", this.loadMorePosts);
// 	console.log("this has connected", this.element);
// }
//
// disconnect() {
// 	window.addEventListener("scroll", this.loadMorePosts);
// }
//
// loadMorePosts = () => {
// 	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
// 		const nextPage = this.data.get("next-page");
// 		if (nextPage) {
// 			this.loadNextPage(nextPage);
// 		}
// 	}
// };
//
// loadNextPage(page) {
// 	fetch(`${window.location.pathname}?page=${page}`)
// 		.then((response) => response.text())
// 		.then((html) => {
// 			this.postsContainerTarget.innerHTML += html;
// 			this.data.set("next-page", Number.parseInt(page) + 1);
// 		});
// }
// }
