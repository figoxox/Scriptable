let widget = await createWidget()

// UI config
//   let gradient = new LinearGradient()
//   gradient.locations = [0, 1]
//   gradient.colors = [  
//       new Color("#2a3132"),
//       new Color("#336B87")
//   ]
//   widget.backgroundGradient = gradient
widget.backgroundColor = new Color("141414")
let textColor = await Color.white()

if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget() {	  
  let widget = new ListWidget()
		
  let titleStack = widget.addStack()
  titleStack = await createTitle(widget)
  titleStack.addSpacer(12)
  
  let bodyStack = widget.addStack()
  bodyStack.layoutHorizontally()
  
  let btcStack = bodyStack.addStack()
  btcStack = await createCriptoStack(btcStack, "btc-clp")

  
  bodyStack.addSpacer(75)
  
    
  let ethStack = bodyStack.addStack()
  ethStack = await createCriptoStack(ethStack, "eth-clp")
	  
  return widget
}

async function createTitle(titleStack) {
  let title = "" //"Resumen de Buda"
  let appIcon = await loadIcon("https://www.buda.com/assets/buda/logo-white-c2bbbcffe1fe4f30d1815d2807b8326e8cc0e6ffe1547decf23a35a123125386.png")
  let appIconElement = titleStack.addImage(appIcon)
  appIconElement.imageSize = new Size(75, 15)
  appIconElement.cornerRadius = 4
//   titleStack.addSpacer(4)
  let titleElement = titleStack.addText(title)
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(11)  
  
  return titleStack
}

async function loadIcon(url) {
  let req = new Request(url)
  return req.loadImage()
}

async function loadTicker(marketId) {  
  let request = new Request("https://www.buda.com/api/v2/markets/" + marketId + "/ticker")
  let json = await request.loadJSON()
  return json

}

async function createCriptoStack(criptoStack, marketId) { 
  let textTitle = ""
  let iconUrl = ""
  
  if (marketId.localeCompare("btc-clp") == 0) {
    textTitle = "Bitcoin"
    iconUrl = "https://github.com/figoxox/Scriptable/blob/master/images/bitcoin-icon.png"
  } else if (marketId.localeCompare("eth-clp") == 0) {
    textTitle = "Etherum"
    iconUrl = "https://github.com/figoxox/Scriptable/blob/master/images/eth-icon.png"
  }  
  
  // Get ticker for Cryptocoins
  let jsonTicker = await loadTicker(marketId)
  ticker = jsonTicker.ticker
  
  // Get data frim JSON
  //  [0] price [1] base currency
  let tickerLastPrice = Math.round(ticker.last_price[0])
  let tickerBaseCoin = ticker.last_price[1]
  let tickerVar24h = ticker.price_variation_24h
  criptoStack.layoutVertically()
  
  // Create stack title
  let titleStack = criptoStack.addStack()
  titleStack.layoutHorizontally()
  
  let icon = await loadIcon(iconUrl)
  let iconElement = titleStack.addImage(icon)
  iconElement.imageSize = new Size(15, 15)
  iconElement.cornerRadius = 4
  titleStack.addSpacer(4)
  
  let label = titleStack.addText(textTitle)  
  label.textColor = Color.white()
  label.leftAlignText()
  label.font = Font.systemFont(15)
  label.textOpacity = 0.5
  criptoStack.addSpacer(4)
  
  // Create stack variation
  let var24hStack = criptoStack.addStack()
  
  // Calculated percentage with two decimal
  let var24hPercentage = Math.round(tickerVar24h * 10000) / 100

  let var24hLabel = var24hStack.addText("24H ")
  var24hLabel.textColor = Color.white()
  var24hLabel.leftAlignText()  
  var24hLabel.font = Font.boldSystemFont(13)
  var24hLabel.textOpacity = 0.7
  
  let var24hData = var24hStack.addText(var24hPercentage + "%")
  var24hData.textColor = (var24hPercentage > 0) ? Color.green() : Color.red()
  var24hData.leftAlignText()  
  var24hData.font = Font.boldSystemFont(13)
  var24hData.textOpacity = 0.7
  
  criptoStack.addSpacer(4)
  
  // Create stack price
  let price = criptoStack.addText(tickerBaseCoin + " $" + tickerLastPrice.toLocaleString().replace(/,/g, '.'))
  price.textColor = Color.white()
  price.leftAlignText()  
  price.font = Font.boldSystemFont(13)
  price.textOpacity = 0.7
  criptoStack.addSpacer(4)
  
  return criptoStack
  
}
