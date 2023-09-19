import Head from "next/head";

function IndexPage() {
	return (
		<>
			<Head>
				<title>Yep</title>
				<meta name="description">
					This text will appear in the description section of search engine
					results.
				</meta>
				{/* <link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
					integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
					crossOrigin="anonymous"
					referrerPolicy="no-referrer"
				/> */}
			</Head>
			{/* ... */}
		</>
	);
}

export default IndexPage;
