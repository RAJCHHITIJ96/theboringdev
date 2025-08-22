// Process PERFORMANCE_TRACKING data (database_id: 6)
export async function processPerformanceTrackingData(supabaseClient: any, rawData: any) {
  console.log(`🚀 Processing PERFORMANCE_TRACKING data:`, JSON.stringify(rawData, null, 2));
  
  try {
    // Validate required fields
    if (!rawData.keyword_id && !rawData.keyword) {
      throw new Error('Missing required field: keyword_id or keyword');
    }

    // Generate unique IDs to avoid conflicts in batch processing
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    const structuredData = {
      tracking_id: rawData.tracking_id || `track_${timestamp}_${random}`,
      keyword_id: rawData.keyword_id || rawData.keyword || `keyword_${timestamp}_${random}`,
      content_url: rawData.content_url || rawData.url,
      current_ranking_position: rawData.current_ranking_position || rawData.position,
      monthly_organic_traffic: parseInt(rawData.monthly_organic_traffic || rawData.traffic || 0),
      monthly_organic_traffic_value: parseFloat(rawData.monthly_organic_traffic_value || rawData.traffic_value || 0),
      click_through_rate: parseFloat(rawData.click_through_rate || rawData.ctr || 0),
      conversion_rate: parseFloat(rawData.conversion_rate || rawData.conversions || 0),
      revenue_generated: parseFloat(rawData.revenue_generated || rawData.revenue || 0),
      gumroad_sales_attributed: parseInt(rawData.gumroad_sales_attributed || rawData.gumroad_sales || 0),
      backlinks_earned: parseInt(rawData.backlinks_earned || rawData.backlinks || 0),
      social_shares_total: parseInt(rawData.social_shares_total || rawData.social_shares || 0),
      time_on_page_seconds: parseInt(rawData.time_on_page_seconds || rawData.time_on_page || 0),
      bounce_rate: parseFloat(rawData.bounce_rate || rawData.bounce || 0),
      publish_date: rawData.publish_date || rawData.published,
      ranking_history: rawData.ranking_history || rawData.rankings,
      traffic_history: rawData.traffic_history || rawData.traffic_data,
      last_updated: new Date().toISOString()
    };

    console.log(`💾 Final structured data for insertion:`, JSON.stringify(structuredData, null, 2));
    
    const result = await supabaseClient
      .from('performance_tracking')
      .insert([structuredData]);
    
    if (result.error) {
      console.error(`❌ Database insertion failed:`, result.error);
      return result;
    }
    
    console.log(`✅ Database insertion successful!`);
    return result;
    
  } catch (error) {
    console.error(`🚨 Fatal error in processPerformanceTrackingData:`, error);
    return { error: error };
  }
}