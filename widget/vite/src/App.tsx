import { MarswapWidget } from '@marswap-exchange/widget';

const SwapTitle = () => {
  return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
              src='https://agg.marswap.exchange/marswap-logo-modified.png'  // Replace this URL with the URL of the logo you wish to display
              style={{ width: 32, height: 32, marginRight: 10 }} 
              alt='Marswap Logo'
          />
          <p style={{ margin: 0, fontSize: 24 }}>Swap Title</p>
      </div>
  );
}

export const App = () => {
  return (
    <MarswapWidget     
      apiKey={'4b5f885c-b764-4160-95f4-00ceb5124abb'} //Example API Key
      integration={
        {
          id: 'test-widget',
          feeAmount: '0.1', // 0.1%
          feeReceiver: '0x_fee_wallet_address' // Enter wallet address to receive fees
        }
      } 
      tokenList={[
          {
              chainId: 109,
              address: '0xABbAF2746C46f8F269e0a252285ABE9d8D8CDf63',
              symbol: 'MSWAPF',
              name: 'MarSwap Farm',
              decimals: 18,
              buyTokenOrSellTokenHasFees: true,
              logoURI: 'https://dex.marswap.exchange/images/tokens/MSWAP.png',
          },
          {
              chainId: 25,
              address: '0xaad00d36dbc8343c3505ba51418a43d3622d2964',
              symbol: 'CLMRS',
              name: 'Crolon Mars',
              decimals: 18,
              buyTokenOrSellTokenHasFees: true,
              logoURI: 'https://assets.coingecko.com/coins/images/26385/standard/resized-image-Promo-removebg-preview.png?1696525462',
          },
      ]}    
      useMarswapTokenList={true} //Set false to only use the token list above. 
      defaultTokenIn={{
          109:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          25:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      }}
      defaultTokenOut={{
          109:'0xABbAF2746C46f8F269e0a252285ABE9d8D8CDf63',
          25:'0xaad00d36dbc8343c3505ba51418a43d3622d2964'
      }} 
      defaultChainId={109} //Shibarium 
      defaultSlippage={'5'} // 5%
      title={<SwapTitle />} //Pass the swap title component into the Widget
      theme={{
        //Text colors
        text: '#FFFFFF',
        subText: '#a2a2a2',
        buttonText: '#212121',
        cardTitle: '#FFFFFF',
        
        //Font
        fontFamily: 'Roboto',
        
        //Component colors
        primary: '#090909', //Card background
        dialog: '#ff890b', //Pop-up card background and main button text
        secondary: '#1C1C1C', //Inner boxes
        interactive: '#FFFFFF',
        stroke: '#505050',
        accent: '#ff890b', //Main button and refresh logo
        success: '#189470',
        warning: '#FF9901',
        error: '#F84242',
        
        //Radii and Shadow
        borderRadius: '8px',
        buttonRadius: '5px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.04)'
      }}
    />
  );
};