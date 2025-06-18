import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background mt-24 border-t text-xs">
      <div className="container px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-6 lg:col-span-1">
            {/* Company Logo */}
            <section className="flex items-center space-x-2">
              <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-full">
                <div className="bg-background h-4 w-4 rounded-full"></div>
              </div>
              <span className="text-xl font-bold">Shop</span>
            </section>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Company
            </h3>
            <nav aria-label="Company links">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Shop & Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Shop
            </h3>
            <nav aria-label="Shopping links">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/products"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Deals & Offers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new-arrivals"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bestsellers"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gift-cards"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Support
            </h3>
            <nav aria-label="Support links">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/help"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/size-guide"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track-order"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Track Your Order
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Contact
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Phone
                  className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <a
                    href="tel:+1234567890"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label="Call customer service"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin
                  className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <address className="text-muted-foreground not-italic">
                    123 Commerce St
                    <br />
                    New York, NY 10001
                  </address>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wider uppercase">
                Customer Service
              </h4>
              <div className="flex items-start space-x-2">
                <Mail
                  className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <a
                    href="mailto:support@shop.com"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label="Email customer support"
                  >
                    support@shop.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright & Social Media */}
        <section className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            {/* Copyright */}
            <div className="text-muted-foreground text-xs">
              © 2023 Shop. All rights reserved.
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Follow us on X"
              >
                <svg
                  className="size-4 fill-current"
                  height="23"
                  viewBox="0 0 1200 1227"
                  width="23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 fill-current"
                  viewBox="0 0 256 256"
                >
                  <path d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
