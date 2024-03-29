package com.webapptemplate;

import java.lang.String;
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.view.KeyEvent;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.app.AlertDialog;

public class MainActivity extends Activity
{
	private static final String HOSTURL = "kovacsv.hu";
	private WebView webView;

	private class MyWebViewClient extends WebViewClient {
		@Override
		public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
			view.loadUrl("file:///android_asset/html/error.html");
		}
	
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			if (url.contains (HOSTURL)) {
				return false;
			}
			Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			startActivity(intent);
			return true;
		}
	}

	//@Override
	//public boolean onKeyDown(int keyCode, KeyEvent event) {
	//	if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
	//		webView.goBack();
	//		return true;
	//	}
	//	return super.onKeyDown(keyCode, event);
	//}

	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
		webView = new WebView(this);
		setContentView(webView);
		
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webView.clearCache(true);
		
		webView.setWebViewClient(new MyWebViewClient());
		webView.loadUrl("http://" + HOSTURL);
	}
}
