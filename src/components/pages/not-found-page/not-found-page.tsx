import CustomButton from "@/components/custom/custom-button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Large 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary/50 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have wandered off on its
            own adventure. Let&apos;s get you back on track!
          </p>
        </div>

        {/* Action Button */}
        <Link href="/" className="inline-block">
          <CustomButton
            variant="outline"
            className="px-8 py-4 border-none bg-secondary text-white transition-all duration-300 rounded-full text-lg font-medium "
          >
            <svg
              className="w-5 h-5 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              ></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            Back to Home
          </CustomButton>
        </Link>

        {/* Additional Help Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Try these instead:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/feed"
              className="text-prifrom-primary  text-sm font-medium transition-colors"
            >
              Explore Feed
            </Link>
            <Link
              href="/connections"
              className="text-prifrom-primary  text-sm font-medium transition-colors"
            >
              Connections
            </Link>
            <Link
              href="/search"
              className="text-prifrom-primary  text-sm font-medium transition-colors"
            >
              Group
            </Link>
            <Link
              href="/journeys"
              className="text-prifrom-primary  text-sm font-medium transition-colors"
            >
              Event
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
