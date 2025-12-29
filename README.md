<h1 align="center">Framework7 - Toolbar Highlight Plugin</h1>

<p align="center">Plugin for integrating a toolbar in iOS 26.2 design (Liquid Glass) for Framework7 v9 apps</p>

## Example

<p align="center">
<img src="https://github.com/user-attachments/assets/4f971676-f584-4798-b45b-a657f52fecc9">
</p>

## Description

Vladimir did a fantastic job with the current version of Framework7. However, there was one thing I felt was missing: a toolbar with icons that behaves exactly like the one in iOS 26. While the Tabbar works perfectly, 
it didn't allow for navigating between different pages; it was strictly limited to switching between tabs. That’s why I wrote this plugin for myself to meet those specific requirements. Feel free to use it!

Take a look at the latest version of Framework7: <a href="https://github.com/framework7io/framework7">https://github.com/framework7io/framework7</a>

## Features

- Fluid animation of the link highlighter
- Touch indicator follows the finger movements
- Fisheye effect for link icons and labels
- The link beneath the touch indicator becomes active automatically
- Linked pages are navigated to only after the animation has finished
- Minimum and maximum positions of the touch indicator are restricted via clamping
- Animation resets whenever the web app loses or regains focus

## Markup

pages/welcome.f7:

```
		<div class="toolbar toolbar-bottom toolbar-highlight-enabled">
			<div class="toolbar-inner">
				<div class="toolbar-pane">
					<div data-target="/welcome/" class="link link-active">
						<i class="icon f7-icons">house_fill</i>
						<span class="label">Welcome</span>
					</div>
					<div data-target="/blog/" class="link">
						<i class="icon f7-icons">book_fill</i>
						<span class="label">Blog</span>
					</div>							
					<div data-target="/shop/" class="link">
						<i class="icon f7-icons">cart_fill</i>
						<span class="label">Shop</span>
					</div>
					<div data-target="/bookmarks/" class="link">
						<i class="icon f7-icons">star_fill</i>
						<span class="label">Bookmarks</span>
					</div>
				</div>
			</div>
		</div>
```
Note: The links in the toolbar are DIV containers. The link destination is defined via the data-target attribute. This is necessary because iOS displays a context menu with the link name when a link is pressed for a longer period. Using a `<div>` instead of an `<a href="">`-tag prevents this behavior.
Furthermore, this approach "outsmarts" the router: it ensures the animation completes before calling `router.navigate()` to trigger the page transition.

## Install

Copy the files toolbarHighlightPlugin.js and toolbarHighlightPlugin.css into your project. 
Link them in your index file after the Framework7 files. 
Create your toolbar as shown in the example. 
Please note that the links are not standard HTML links, instead the link destination is specified in the data-target attribute.
