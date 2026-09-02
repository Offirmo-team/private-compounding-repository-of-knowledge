
## Intro
* landing https://pages.github.com/
* doc https://docs.github.com/en/pages

Concepts:
* GitHub Pages default domain = `<user>.github.io` or `<organization>.github.io`
* custom domain
* apex domain vs. www.
* one site per GitHub account and organization
* unlimited project sites


## Usage
XXX There seems to be 2 ways of setting up a custom domain. Unclear which one is better. Or should do both? (seen working for a user without the A & AAA)

1. A & AAAA redirection to Github servers cf. https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#dns-records-for-your-custom-domain
1. CNAME redirection to username.github.io (or orgname.github.io) cf. https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#dns-records-for-your-custom-domain


1. verify the domain
   * https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
     * Create a TXT record in your DNS configuration for the following hostname: ...
     * Use this code for the value of the TXT record: ...
2. add it to the Github repo "pages"
   * with `www`
   * wait for "DNS Check in Progress"...
3. fix the DNS records
   * or else `NotServedByPagesError`
   * [DNS records for your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#dns-records-for-your-custom-domain)
4. enable "forced HTTPS" in the repo "pages"
   * need the DNS to be correct + ~15min 

* root
  * username.github.io
