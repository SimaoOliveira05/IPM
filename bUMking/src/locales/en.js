export default {
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    theme: {
      day: 'Day',
      night: 'Night'
    },
    lang: {
      pt: 'Portuguese',
      en: 'English'
    }
  },
  account: {
    welcome: 'Hello, {name}',
    visitor: 'Visitor',
    saved_cities: 'Saved Cities',
    saved_hosts: 'Favorite Hosts',
    saved_listings: 'Saved Listings',
    empty_cities: 'You haven\'t saved any cities yet.',
    empty_hosts: 'You haven\'t added any favorite hosts yet.',
    empty_listings: 'You haven\'t saved any listings yet.'
  },
  auth: {
    signin: 'Sign in',
    register: 'Register',
    login_btn: 'Log in',
    create_account: 'Create account',
    have_account: 'already have an account?',
    no_account: 'no account yet?',
    action_enter: 'sign in',
    action_register: 'register',
    description: 'Sign in to save dashboards and custom alerts.',
    name_label: 'Name',
    name_placeholder: 'name...',
    email_label: 'Email',
    email_placeholder: 'email...',
    password_label: 'Password',
    password_placeholder: 'password...',
    error_credentials: 'Incorrect email or password',
    my_account: 'My account',
    logout: 'Log out',
    toggle_password: 'Toggle password visibility'
  },
  hero: {
    title: 'Analyze Airbnb trends in seconds',
    subtitle: 'Search any city, neighborhood, or host with official Airbnb data to reveal prices, occupancy, and ratings.',
    tag: 'bUMking'
  },
  search: {
    location_label: 'Location',
    location_placeholder: 'Search cities, neighborhoods, hosts...',
    type_label: 'Type',
    type_placeholder: 'Select type',
    type_title: 'Search type',
    sort_title: 'Sort by',
    quick_actions: 'Quick actions',
    sort_placeholder: 'Sort',
    categories: {
      hosts: 'Hosts',
      listings: 'Listings',
      neighbourhoods: 'Neighbourhoods'
    }
  },
  sort: {
    rating_best: 'Best rating',
    rating_worst: 'Worst rating',
    price_highest: 'Price (highest)',
    price_lowest: 'Price (lowest)',
    alphabetical: 'Alphabetical'
  },
  stats: {
    monitored_cities: 'Monitored cities',
    active_listings: 'Active listings',
    analyzed_hosts: 'Analyzed hosts'
  },
  insights: {
    benchmark: {
      title: 'Price Benchmark',
      description: 'Compare average nightly rates and detect seasonal peaks in a few clicks.'
    },
    availability: {
      title: 'Availability & Occupancy',
      description: 'Analyze weekly occupancy, cancellations, and minimum stays for each market.'
    },
    reputation: {
      title: 'Ratings & Reputation',
      description: 'Identify top-rated hosts and what sets them apart from the rest.'
    },
    discover_title: 'What you can discover',
    view_more_stats: 'View more statistics →'
  },
  dashboard: {
    listings_title: 'Listings Overview',
    hosts_title: 'Hosts Overview',
    active_listings: 'Active Listings',
    avg_price_night: 'Avg Price/Night',
    occupancy_rate: 'Occupancy Rate',
    avg_rating: 'Avg Rating',
    total_hosts: 'Total Hosts',
    avg_revenue: 'Avg Revenue',
    distribution_type: 'Distribution by Property Type',
    top_neighborhoods: 'Top Neighborhoods by Listings',
    market_distributions: 'Market Distributions',
    top_hosts_revenue: 'Top Hosts by Revenue',
    top_hosts_listings: 'Top Hosts by Listings',
    listings_unit: 'listings',
    price: 'Price',
    occupancy: 'Occupancy',
    revenue: 'Revenue',
    price_eur: 'Price (€)',
    occupancy_days: 'Occupancy (days)',
    revenue_eur: 'Revenue (€)',
    cdf_label: 'Cumulative Distribution',
    mean: 'Mean',
    median: 'Median',
    percentile: 'Percentile',
    cumulative_percentile: 'Cumulative Percentile',
    year: 'Year:',
    market_analysis_title: 'Market Analysis',
    calculating: 'Calculating statistics...',
    anomalies_title: 'Detected Anomalies',
    context_city: 'City',
    context_neighbourhood: 'Neighbourhood',
    context_global: 'Global',
    est: '(Est.)',
    days: 'days',
    // Analytics
    competitiveness: {
      dominant: 'Dominant',
      strong: 'Strong',
      medium: 'Medium',
      weak: 'Weak'
    },
    alignment: {
      misaligned_low: 'Misaligned',
      premium: 'Premium',
      undervalued: 'Undervalued',
      overvalued: 'Overvalued',
      balanced: 'Balanced',
      desc_misaligned_low: 'Low Price, Low Occupancy',
      desc_premium: 'High Demand',
      desc_undervalued: 'Opportunity to Raise',
      desc_overvalued: 'Vacancy Risk',
      desc_balanced: 'Ideal Balance'
    },
    market_fit: {
      excellent: 'Excellent Fit',
      good: 'Good Fit',
      needs_work: 'Needs Adjustment',
      bad: 'Market Misalignment'
    },
    anomalies: {
      premium_price: 'Premium Price (> P90)',
      low_cost: 'Low Cost (< P10)',
      critical_rating: 'Critical Rating',
      low_rating: 'Low Rating (< 4.0)',
      top_revenue: 'Top Revenue Generator',
      low_occupancy: 'Critical Low Occupancy'
    },
    performance: {
      above_average: 'Above Average',
      below_average: 'Below Average'
    },
    summary_intro: 'This listing is positioned in the {price}th price percentile and {occupancy}th occupancy percentile.',
    summary_pos: 'Analysis indicates a {alignment} positioning, resulting in a competitiveness score of {score}/100 ({label}).',
    summary_anomalies: 'Anomalies detected: {list}.',
    summary_recommendation_good: 'The property shows a good market fit, suggesting the current strategy should be maintained.',
    summary_recommendation_bad: 'Reviewing pricing strategy or improving amenities is recommended to increase competitiveness.',
    alignment_desc: 'Based on the relationship between price percentile ({price}) and occupancy percentile ({occupancy}) in the {context} context.',
    revenue_expected: 'Expected vs Actual Revenue',
    revenue_actual: 'Actual',
    revenue_target: 'Expected (P50-P75)',
    analysis_summary: 'Analysis Summary ({context})',
    price_occupancy_alignment: 'Price-Occupancy Alignment'
  },
  listing: {
    loading: 'Loading information...',
    error: 'Error loading data',
    retry: 'Try again',
    back: 'Back',
    description: 'Description',
    per_night: 'per night',
    view_airbnb: 'View on Airbnb'
  },
  results: {
    count_label: 'results',
    per_page: 'Results per page',
    empty_title: 'No results',
    empty_description: 'Try adjusting your search or choosing another dimension.'
  },
  listing_details: {
    housing: 'Housing',
    type: 'Type',
    bedrooms: 'Bedrooms',
    capacity: 'Capacity',
    beds: 'Beds',
    bathrooms: 'Bathrooms'
  },
  host_profile: {
    about: 'About',
    properties: 'Properties',
    superhost: 'Superhost',
    verified: 'Verified',
    member_since: 'Member since',
    response_rate: 'Response rate',
    response_time: 'Response time',
    acceptance_rate: 'Acceptance rate',
    view_profile: 'View on Airbnb',
    no_listings: 'This host has no registered listings.',
    title_stats: 'Host Statistics',
    host_label: 'Host',
    not_available: 'Host information not available',
    no_listings_year: 'No listings registered for this year.'
  },
  host_analytics: {
    room_type_dist: 'Accommodation Types',
    rating_dist: 'Ratings Distribution',
    price_dist: 'Price Distribution',
    ratings: 'Ratings',
    prices: 'Prices',
    num_listings: 'Number of Listings',
    range: 'Range'
  },
  location: {
    title_stats: 'Statistics',
    market_analysis: 'Market Analysis',
    accom_type: 'Accommodation type',
    neighbourhood: 'Neighbourhood',
    city: 'City',
    comparison_city: 'City Average',
    comparison_global: 'Global',
    compare_with: 'Compare with:',
    no_data: 'No data available',
    room_types: {
      entire_home: 'Home',
      private_room: 'Private room',
      shared_room: 'Shared room',
      hotel_room: 'Hotel room'
    }
  },
  filters: {
    filter_btn: 'Filter',
    refine_results: 'Refine results',
    house_type: 'House type',
    anomalies_only: 'Only with anomalies',
    price_range: 'Price range',
    rating: 'Rating',
    clear_filters: 'Clear filters',
    apply: 'Apply'
  },
  documentation: {
    title: 'Documentation',
    nav: {
      search: 'How to Search',
      data: 'Data Organization',
      scoring: 'Scoring System',
      revenue: 'Expected Revenue',
      anomalies: 'Anomalies Guide'
    },
    general: {
      example: 'Example'
    },
    sections: {
      data: {
        title: 'Data Organization',
        content: 'Our platform organizes market data chronologically, grouped by years (e.g., 2023, 2024, 2025). This allows you to track historical trends and compare performance across different seasons. Listings are evaluated within their specific year context to ensure fair comparisons.'
      },
      scoring: {
        title: 'Housing Score (0-100)',
        description: 'The Competitiveness Score is a composite rating (0-100) that evaluates a listing\'s market strength. It is calculated by combining three key performance percentiles:',
        factors: {
          price: 'Price Percentile (40% weight)',
          occupancy: 'Occupancy Percentile (40% weight)',
          revenue: 'Revenue Percentile (20% weight)'
        },
        example: 'A high score indicates a "Dominant" listing—one that maintains high prices while ensuring high occupancy. For example, a listing in the 90th percentile for price and occupancy would receive a near-perfect score, signaling strong market demand.'
      },
      revenue: {
        title: 'Expected Revenue',
        content: 'Expected revenue is a market projection derived from the 50th-75th percentile of similar listings in your area. Unlike historical data, this is a forward-looking benchmark to help you gauge potential earnings if your property performs among the top competitors. It is not a guaranteed value, but a target based on current market conditions.',
        example: 'For instance, if similar 2-bedroom listings in your neighborhood earn between €1,500 and €2,000, your expected revenue target might be €1,800. This helps you identify if you are underperforming compared to the market potential.'
      },
      anomalies: {
        title: 'Understanding Anomalies',
        intro: 'We automatically detect statistical anomalies to highlight outliers in the market. Here is what they mean:',
        list: {
          premium_price: { 
            label: 'Premium Price (> P90)', 
            desc: 'The listing price is in the top 10% of the market. This indicates a luxury or high-end property.' 
          },
          low_cost: { 
            label: 'Low Cost (< P10)', 
            desc: 'The listing price is in the bottom 10% of the market. Competitively priced or potentially undervalued.' 
          },
          critical_rating: { 
            label: 'Critical Rating (Percentile < 20)', 
            desc: 'The listing\'s rating is in the bottom 20% compared to peers, indicating performance issues.' 
          },
          low_rating: { 
            label: 'Low Rating (< 4.0)', 
            desc: 'The absolute average rating is below 4.0 stars. This is considered a quality warning.' 
          },
          top_revenue: { 
            label: 'Top Revenue Generator (> P90)', 
            desc: 'This listing generates more revenue than 90% of competitors, marking it as a top performer.' 
          },
          low_occupancy: { 
            label: 'Critical Low Occupancy (< P10)', 
            desc: 'The listing is occupied less frequently than 90% of the market, signaling potential visibility or pricing issues.' 
          }
        }
      },
      search: {
        title: 'How to Use Search',
        intro: 'The search bar is the fastest way to find information about listings, hosts, and neighbourhoods in the Airbnb dataset.',
        what_title: 'What Can You Search?',
        what_desc: 'You can search by location (city, neighbourhood), listing name, or host name and then filter by category:',
        categories: {
          listings: {
            title: 'Listings',
            desc: 'List of all accommodations available in the searched location.',
            examples: ['Porto → All listings in Porto', 'Ribeira → Listings in the Ribeira area', 'Downtown Apartment → Listings with that name']
          },
          hosts: {
            title: 'Hosts',
            desc: 'List of hosts registered on the platform, with their properties.',
            examples: ['Porto → Hosts with properties in Porto', 'Foz → Hosts in the Foz area']
          },
          neighbourhoods: {
            title: 'Neighbourhoods',
            desc: 'Aggregated statistics by neighbourhood: average price, occupancy, ratings.',
            examples: ['Porto → All neighbourhoods in Porto', 'Paranhos → Statistics for Paranhos']
          }
        },
        steps_title: 'Step by Step',
        steps: {
          choose: { title: 'Choose the category', desc: 'Use the "Listings" dropdown to select what you want to search: Listings, Hosts, or Neighbourhoods.' },
          type: { title: 'Type your search', desc: 'Enter the city, neighbourhood, listing name, or host name. The search looks through all locations and names in the dataset.' },
          click: { title: 'Click the search button', desc: 'Press the magnifier icon or the Enter key to see the results.' },
          filter: { title: 'Use filters (optional)', desc: 'On the results page, you can refine with price, accommodation type, rating filters and more.' }
        },
        tips_title: 'Useful Tips',
        tips: {
          partial: { title: 'Partial search:', desc: 'You don\'t need to type the full name. \'Rib\' finds \'Ribeira\'.' },
          switch: { title: 'Switch category:', desc: 'You can switch between Listings/Hosts/Neighbourhoods in results without losing your search.' },
          filters: { title: 'Advanced filters:', desc: 'Use "Filter" to refine by price, rating, house type and anomalies.' },
          sort: { title: 'Sort results:', desc: 'Use "Sort" to view by price, rating, occupancy or revenue.' }
        },
        example_label: 'Practical Example:',
        example_text: 'To find cheap apartments in Ribeira: Search "Ribeira" → Category "Listings" → Click "Filter" → Set max price €50 → Click "Apply".'
      }
    }
  },
  metrics: {
    total_listings: 'Listings',
    total_hosts: 'Hosts',
    avg_price: 'Avg Price',
    avg_rating: 'Avg Rating',
    avg_occupancy: 'Avg Occupancy',
    avg_revenue: 'Avg Revenue',
    total_revenue_est: 'Total Revenue (Est.)'
  }
}
