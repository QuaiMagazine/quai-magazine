[01] [#Tag] 2025-08-13 Tech AMA with Dr K - Monero 51 Attack
As a professional content strategist for Quai Magazine, I have analyzed the Tech AMA document from Aug 13, 2025. Below is an analysis of the core topics and technical themes, followed by recommended website tags.
Content Analysis
Core Topics: The discussion primarily centers on a "sub-51% liveness attack" occurring on the Monero network, attributed to Qubic's mining behavior. It contrasts this with Quai Network’s architectural defenses.
Technical Concepts: Key concepts include Work Shares (frequent hash rate sampling to reduce variance), Proof-of-Work (PoW) design, Reorganizations (Reorgs), and Structured vs. Unstructured Directed Acyclic Graphs (DAGs).
Key Themes: Security and finality in PoW systems, the importance of high-resolution hash rate sampling, and the competitive advantages of Quai over other protocols like Caspa and Monero.
-----
Recommended Website Tags
#QuaiNetwork
The AMA highlights Quai's unique work-share model and structured DAG as superior architectural solutions for network security and finality.
#Monero
A significant portion of the content analyzes how Monero's current PoW design is susceptible to sub-51% reorg attacks by minority miners.
#WorkShares
This is the central technical solution discussed for reducing mining variance and making liveness attacks much more difficult to execute.
#PoW
The discussion focuses deeply on the mechanics, economics, and future of Proof-of-Work consensus, specifically comparing different sampling methods.
#MiningSecurity
The dialogue covers the practical risks of minority hash rate manipulation and the importance of transaction finality in mining environments.
#BlockchainReorg
The document explains how "red empty blocks" and private branches lead to chain reorganizations, causing uncertainty for exchanges and users.
#SmartContracts
A key differentiator mentioned is Quai’s ability to support L1 programmability and smart contracts, which is contrasted with Caspa’s architecture.
#MiCA
The AMA addresses the impact of the EU's MiCA regulatory framework on the tradability and compliance of Quai and Qi tokens.



[01] [Edited RAW Transcript] 2025-08-13 Tech AMA with Dr K - Monero 51 Attack
📝 [01] [Aug 13, 2025] Tech AMA with Dr. K - Monero 51% Attack | Full Edited RAW Transcript | Edited by Raju

Full RAW Transcript:

[Matt (Speaker 1)]: Done. Space name updated. 

[Dr. K (Speaker 2)]: Um.....

[Matt (Speaker 1)]: Been paying attention to this? Tangentially, right? So I'm aware Qubic is merge mining Monero. And, you know, it seems like they're consuming a lot of the overall hash rate. And they're messing with the economics somewhat. But a breakdown would be absolutely awesome. Oh. Jonathan's dropping a link here. Monero Consensus info seems to have some more information. I'm going to pull this up and see what we're looking at. But feel free, Dr. K. Take it Away.

[Dr. K (Speaker 2)]: Yeah. So, basically, Qubic has a mining algo where they, like, do these, like, clocks. When they're mining so you can't mine Qubic all the time you have to like do some sort of transition on the algo and so what Qubic does is they're using that to merge mine other tokens and then sell them and then buy Qubic so they don't like give the rewards to miners they just like take the reports oh no Yeah, and, like, sell them in my Qubic.

[Matt (Speaker 1)]: So they're mining Monero and dumping it?

[Dr. K (Speaker 2)]: Yeah, it's a super shady project, right? So they said that they do AI inference, but, like, they don't do AI inference. They're just a GP-mined algo. But their whole thing is that they're doing, like, useful work because it's somehow usable for AI, but, like, it's not. You can look at the code base. There's not a single thing that has anything to do with AI. 

You know if i'm gonna be like devil's advocate i guess some feature of their hashing algorithm like looks like a neural network but it's not used for anything so like cool it's just a neural network or sorry an algorithm that runs a transformer it's complete and utter horseshit anyhoo what ends up happening is they they merge mine with Monero so everyone who's like mining, they're, they're taking over their CPUs and also mining Monero. And, they're like selling the Monero. I don't even think they're giving a Monero like to the people that is like selling it through the Qubic organization, whatever that is.  Look, because they have like enough tax rate, they've gotten to the point where they can like kind of play with Monero. I think it's like 25% of the network cash. And so what they're doing is they're executing these, sort of reorg attacks. So in proof of work consensus, the way that your transaction is finalized is it gets deep enough in the blockchain. And once it's deep enough in the blockchain, you can be like, okay, I'm good. This isn't getting reversed. So what Kubrick is doing is they're basically saying we're going to mine uncooperatively. So we're going to mine to try to create force. And as we create forks, we can sort of attack the liveness guarantee in Monero. So normally, maybe in Monero, after a couple blocks, most people would be like, cool, I've received my money. What they're doing with Qubic is they're saying, okay, we're going to try to mine like a private chain of like six blocks. And then we're going to reveal it. And if it's longer than the monero blockchain you can compromise blindness but they have to find the six blocks before the monero blockchain does so because they have less than 51 this doesn't happen all the time but it does happen because when you're only looking at say five or six blocks five or six samples of the hash rate 25% can effectively get lucky over those five or six samples and appear for that period of time to be 51% of the hash. So what's happening is they're able to sort of create uncertainty and liveness because Monero doesn't do a good job sampling their hash rate. Right. So if I were to compare this to Quai with Quai, we do a work shares. So for someone to sort of attack Quai, you would indeed have to have 51% of the aggregate hash rate to impugn liveness. But because Monero, doesn't do work shares and it takes, you know, what are Monero blocks? You recall, are they like two minutes or something?

[Matt (Speaker 1)]: I do not. And real quick, FYI, I brought up the website that Jonathan just linked down below. Jonathan, I'm going to send you an invite to speak if you want to come up. Let's see here. Invite to speak. But if you're looking at my screen, Dr. K, I think we're seeing exactly what you're talking about. So at the top here... 

[Dr. K (Speaker 2)]: Oh, yeah. if people can see it in the chat, maybe you can do a screen grab and post a link. But you can See... Kind of like that forking behavior. And what they're trying to do is they're trying to make it so that people basically need to take longer to want to accept a Monero transaction. That's what we mean by liveness. Because as they successfully find these forks, they don't include the transactions that were previously included. Now, a lot of those will just sit in the med pool if they're not overlapping transactions. They'll eventually clear, but then the other problem, too, is for exchanges, the way you kind of, like, play with this. These real deaths aren't, like, long enough to be able to do this, but if they were longer, what you could do is you could send money on Qubic or on Monero, like, to an exchange.

[Matt (Speaker 1)]: I bet a lot of.

[Dr. K (Speaker 2)]: And then as long as like you win that race of the private mining, you could try to deposit your money, transfer to another chain and withdraw your money and then reveal the private fork. And then like those transactions that happen going into that exchange would like no longer exist. Now, if exchanges are, you know, good exchanges and they're thinking about finalization windows, they should be managing their risk appropriately here. To say like, okay, instead of confirming your mid-air transaction in five blocks, I'm going to now wait 50 so they don't expose themselves to this risk, which I think they probably are doing. Well,

[Matt (Speaker 1)]: So a couple of quick questions. So, sorry, first of all, like, I mean, I was under the assumption like 90 plus percent of exchanges aren't even listed in Monero anymore. Is that true?

[Dr. K (Speaker 2)]: Yeah, that's true, but the ones that are are . They're appropriately slowing the trust.

[Matt (Speaker 1)]: Okay, okay tracking and then

[Dr. K (Speaker 2)]: They're

[Matt (Speaker 1)]: There. Yeah, and then to make sure I'm, I'm reading this graph correctly.  , and so the audience can follow along this graph is showing blocks. That are recognized as a known pool. I'm going to assume that's Monero focused mining pools and then unknown pools or solo miners are red blocks. And if we scroll down, we can see a majority of these blocks are actually red blocks. And there's cases here where the chain forks and you can see

[Dr. K (Speaker 2)]: Yeah so it would it would be like that statement if you see like the left and you can you should like screenshot this and this on twitter for people but you see that the situation on the left there

[Matt (Speaker 1)]: Yeah when those blocks pass like that it's

[Dr. K (Speaker 2)]: Like honest actors and then it's it's juxtaposed against potentially dishonest actors right right with the red blocks

[Matt (Speaker 1)]: And i also noticed

[Dr. K (Speaker 2)]: Any any time you're like like forking can happen but anytime you're seeing forks at depth And then you're seeing like red versus green. That is the Qubic guys trying to fuck with Monero.

[Matt (Speaker 1)]: So

[Dr. K (Speaker 2)]: In this particular case, the Qubic guys won and that reversed six Monero blocks.

[Matt (Speaker 1)]: Right. Well, and if you look closely, these blocks are circles, which means that there's no transactions in these blocks. And all the green blocks are squares, which means those had transactions in those blocks. Yeah, so

[Dr. K (Speaker 2)]: It's a liveness attack, right? Yeah. So what it's basically saying is, like, you can't get transactions on the network. And when they, well, for, you have less consistency with getting transactions on the network. And every time they succeed, they're.

[Matt (Speaker 1)]: It looks like they're succeeding quite frequently, actually. Oh, man.

[Dr. K (Speaker 2)]: Well, no, no, but, like, one block doesn't really matter, but, see, that's another three block. Right. And then that's, like, a two block.

[Matt (Speaker 1)]: Right. Now, these ones have transactions, which is, you know, I guess. No, no, no, that might be

[Dr. K (Speaker 2)]: Regular, too.

[Matt (Speaker 1)]: Right, but these ones do not. Here's another one. Holy cow. Yeah, yeah,

[Dr. K (Speaker 2)]: That's, like, a straight, yeah. Now, the thing is, they don't succeed all the time because they don't actually have 51% of the hash. Right? Right.

[Matt (Speaker 1)]: Okay. Okay. And then

[Dr. K (Speaker 2)]: I was also looking... But if Monero had work shares, they wouldn't be able to do this because in a work share-based setting like Quive, if you have sub 51% of the hash, right, the... 

Our ability to identify if you have 51% of the hash basically happens in two zone blocks, right? Statistically. So if you had 25% of the hash, there's like no way you could get lucky for more than two zone blocks to like over-represent your hat rate. Because in those two zone blocks, you'd have an expected sample size of like 17 samples, right? And if you look at the case with Monero, you don't see 17 block reorgs. Right. The deepest you see is like six. So as long as you take more than six samples per block, they can't really even over-represent their hash rate for a single block. 

So if Monero adopted work shares, it would like basically completely fix this problem for them. 

Oh

[Matt (Speaker 1)]: Man. Due to, Qubic mining, Qubic merge mining.

[Speaker 3]: Yeah, but a 51% attack could still happen, right? So there's not something to consider.

[Dr. K (Speaker 2)]: Yeah, so the 51%, though, is... Yeah, I mean, the 51% is like a thing. The point that we're making here is that they're getting attacked sub-51%.

 
[Matt (Speaker 1)]: The Chat is hilarious right now. If you

[Dr. K (Speaker 2)]: Have work shares, they wouldn't be able to attack you sub 51%. That's the statement.

[Matt (Speaker 1)]: Right, right. No, that makes sense because you're sampling the blockchain faster. And so like merge mine attacks like this would have to effectively achieve north of 50%, aka 51%.

[Dr. K (Speaker 2)]: Yeah, yeah. So, I mean, the thing of it is, right, with these, like, the whole point of proof of work is to figure out, like, what the majority of the hash rate is voting on. Right. Right. So, the blocks, historically, if we just look at a linear blockchain, like, are the samples of the hash rate. And so what we have to ascertain is is 51 of the hash like building on your transaction or your block so call that block 10. And in  monero or bitcoin as like linear chain examples, they only get one sample per block. So then the next block is a sample. Now we have two samples, like attesting to your transaction. And then we wait another block, then we get three samples. But the variance that I can have in the three samples relative to the real mean of the mining population is still enormous, right? You don't actually get below, say like a 90%, confidence interval until at least six samples. So if it takes you six blocks and your blocks are two minutes, you're taking 12 minutes to get a 90% confidence in your sampling, which is like patently retarded. You guys. Right we we live in a world that has connectivity and internet you could take your samples much much faster right so what we do with quai is we basically say we know within a five second block we can act in eight samples so we're taking you know say like a sample every half a second roughly right and they're taking a sample like every two minutes And because you're taking a sample half a second, the measurement of your population is like much more accurate, much more quickly. So not saying that this prevents a 51% attack, but it makes it so that the attacker actually has to have 51% of the action.

[Matt (Speaker 1)]: Right. Right. That makes sense. Man, the chat's hilarious right now. I got a tweet up with that screenshot. I need to reply with the actual URL. But John stating, Qubic losing its reputation, it wasn't a good idea to attack other projects. And Keisha was chiming in, did they have an impeccable reputation in the first place? And Veronica sharing some really hilarious memes as well. Dang, this is both super interesting, exciting, but also kind of concerning, actually. Man, poor Monero.

[Speaker 3]: I've actually been thinking about this. Is there a way to construct a special kind of wallet such that double signing results in either your money getting taken or just the transaction failing? So basically what this would do is it would prevent RBF, right? But if you

[Dr. K (Speaker 2)]: Follow the

[Speaker 3]: Rules of the chain appropriately, RBF might not be necessary in certain cases. So

[Matt (Speaker 1)]: If you...

[Speaker 3]: We're worried about this, let's say a 51% attack, right? Not a sub 51%, but let's say you're worried about a 51% attack, then perhaps I would only accept money from individuals who participate in this special wallet scheme such that they can only broadcast one transaction per nonce. And if they tried to broadcast two, I could basically take their money, right? Like i could prove that they signed two messages on the same nonce and like their money would be gone obviously i think they they need collateral for this so

[Dr. K (Speaker 2)]: There there's like well there's there's two there's there's two ways to go about it you can either have them collateralize it or you don't actually quote unquote finalize the transaction for like your debt right so you basically would leave that transaction reversible against like a fraud proof on an RDS or say like 15 blocks or 20 blocks or like whatever the number is. Right. So you can either do it by delaying the recipient's ability to like really know they have the money or by collateralizing it. Those are like your two options. I've also thought about this.

[Speaker 3]: Gosh. Yeah, so basically you would need some backing, but this would be doable, right? So exchanges would only accept deposits if you had backing, like extra money to back your deposit.

[Dr. K (Speaker 2)]: Yeah. Yeah, well, so in this case, because they're doing empty blocks as the attack, there's probably a better way to think about this just in terms of blockville. Does that make sense? Right?

[Speaker 3]: I mean, they could always put transactions in their blocks, like themselves, if they wanted to.

[Dr. K (Speaker 2)]: No, no, but you could juice up the gas fee. Right and then the other thing too is you could make it so that like you just don't pay like below a certain you know transaction fill like you just like don't give rewards out so if you if you juice up the gas fee and you made it so that you didn't pay out until like you got like a half filled block that would also fix

[Matt (Speaker 1)]: The problem. Hey guys, what,  , what do we know about this website, Jonathan, that you just linked? Do you, this is the first time I'm seeing it. A lot of the community members are, are wondering like how accurate this is. What, what, what do we know about it? What can we say about it? It's just a block

[Speaker 3]: Explorer. That's all. Okay.
[Matt (Speaker 1)]: Okay. So, I mean, it, it's, Pulling data off of Monero's blockchain.
[Dr. K (Speaker 2)]: Yeah, the accuracy isn't the data source. It's an interpretation.
[Matt (Speaker 1)]: Right. It's not very specific. We're giving
[Dr. K (Speaker 2)]: You what we think is a fair interpretation. Yeah.
[Matt (Speaker 1)]: They're kind of bucketing the quote-unquote attack into this other bucket, which could include additional actors as well that are not attacking Monero.
[Dr. K (Speaker 2)]: Yeah, no, I mean, the ones that have transactions are definitely not, right? The ones that are, are the ones that are those chains of empties. Yeah. That's pretty obviously Qubic.
[Matt (Speaker 1)]: Yeah, Qubic is not processing Monero transactions, right? We know that for sure.
[Dr. K (Speaker 2)]: Right, right. So when I see a chain of six, like, empties as a fork, like, that tells you it's set.
[Matt (Speaker 1)]: So red circle blocks are, you know, very likely to be Qubic miners.
[Dr. K (Speaker 2)]: Yeah. A
[Matt (Speaker 1)]: Hundred percent. Okay. Okay. A hundred percent. Dr. K says, dang guys, like this is a, this is a more, this is some history right here. I'm kind of geeking out now. Just to
[Dr. K (Speaker 2)]: Be clear, red, red circle blocks, which are in a chain in a reorg is Qubic. Right red circle block that's just like cooperatively in a chain with other blocks that doesn't get reorged that's probably not Qubic that's probably just an actual empty right okay
[Matt (Speaker 1)]: Okay so additional clarification when you see multiple red circle blocks in a row 100 or 99.99 head gene yeah
[Dr. K (Speaker 2)]: That's that's Qubic yeah
[Matt (Speaker 1)]: That's Qubic dang dang we're here for it   It's part of blockchain history going down right now, guys. How do you feel? Quick question, Dr. K. My mind's now kind of going to our space that's coming up tomorrow with Shai. He just wrote an article on work shares, aka PRS. Is this something that we could study retroactively and kind of understand how WorkShares solve for this? And, like, you know, what would this result in at the end of the day once it's all said and done from your perspective as, you know, one of the authors behind WorkShares?
[Dr. K (Speaker 2)]: Yeah, I mean, it would make a sub-51% attack, like, infeasible. So if Monero adopted this, as long as Qubic remains under 51%, the effect of this attack would vanish.
[Matt (Speaker 1)]: Love it. Is that something? That's
[Dr. K (Speaker 2)]: Like the statement.
[Matt (Speaker 1)]: And so, question, is that like something we could like document in an article? Is this like a follow-up to, you know, a paper that you recently published? I'm looking for the tangible output here. I want to go market this shit. You know where my head's at. Yeah, I mean, I think the best way
[Dr. K (Speaker 2)]: To market it would actually be
[Matt (Speaker 1)]: PR. There you go. There you go.
[Dr. K (Speaker 2)]: Like the Monero guys? no i like i'm i'm a i'm a little like weary because like i don't want to have to deal with this shit on koi right   at the moment yeah like i you know well we're here
[Matt (Speaker 1)]: In public now talking about it   we're here
[Dr. K (Speaker 2)]: But we're just we're just talking about monero right like
[Matt (Speaker 1)]: Yeah
[Dr. K (Speaker 2)]: No, I don't, I don't
[Matt (Speaker 1)]: Want to kind of get in the mist with the Qubic folks. Right. No, we got, we got bigger fish to fry. It's just to me again, it's both like exciting and concerning at the same time. I'm not really sure how to feel about it, but this is usually when cool stuff happens.  , chaos breeds opportunities. My heart goes out to the Monero folks, huge privacy advocate over here. I know you are as well, Jonathan, Dr. K, Probably a good thing at this point that they're not listed on all the exchanges they were on recently. But if they come through this, maybe that's actually bullish for them in the long
[Dr. K (Speaker 2)]: Run. Yeah. Dang.
[Matt (Speaker 1)]: Yeah. Man. Man. These Wednesdays are always fun, guys. Really appreciate the conversation. We got some questions.
[Dr. K (Speaker 2)]: Yeah, I mean, like I said, there are other options here like suck a lot more, especially considering like Monero's sort of ethos and footprint. Right. You know, so like whitelisting is potentially an option for them. Yeah. And they could do it without even like, really breaking a sweat. Right. Cause they could, they could literally just go back for the last, say like, you know, two months prior to this happening and just like whitelist every one of those addresses and then just, that's it. And then like Qubic would go away. So that's another solution for them here. But, like, the better one that's not, like, permission would be to just adopt work shares. It would be better for Monero generally, right? It would create less pooling and create better payouts. You could essentially, like, mine Monero on your computer and actually be profitable and not have to have, like, a Threadripper or an Epic, like, grinding away. You could do it on your fucking Mac and still get paid.
[Matt (Speaker 1)]: Right, right. Yep. Man. Fighting the urge to,  , fire up the matrix chat and see what's going on over there. But,  , yeah, we, we got, we got bigger fish to fry over here. Super interesting, man. I'm going to try and follow this a little more closely now. I heard about it tangentially, but seeing it like pictures, pictures worth a thousand words, right? When you see that chain of red circle blocks and the forking, Oh, man, it's insane.
[Dr. K (Speaker 2)]: Yeah, I mean, the crazy part is, like, I don't think they're close to 51%. I think they're, like, probably at 25%.
[Matt (Speaker 1)]: Yeah, well, the other page has other pools sitting around 10%, I want to say. Maybe 10% now.
[Dr. K (Speaker 2)]: Yeah, so the point is, if they just, like, just adopted Workshare, it's like this problem would go away and completely, like, permissionless way. Like,
[Matt (Speaker 1)]: It would just
[Dr. K (Speaker 2)]: Vanish. Yep. Like, straight.
[Matt (Speaker 1)]: Well, and, okay, so, and also, they're also dumping the token, right? They're just collecting and selling? Yeah, they
[Dr. K (Speaker 2)]: Are. I mean, I don't think that's what's hurting, like, Monero's price performance at the moment. I think that's probably North Korea, to be honest.
[Matt (Speaker 1)]: I
[Dr. K (Speaker 2)]: Mean, they stole a billion and a half dollars, like, what, three months ago? Like, it takes them a little bit to clear
[Matt (Speaker 1)]: That market. Yeah. Speaking of which, some news came across my desk earlier this morning. Somebody actually hacked the North Korean state hacker group and dumped, like, nine gigs of data, which is, you know, interesting. Outside of the scope of this conversation. I thought it would be funnier if they
[Dr. K (Speaker 2)]: Hacked their crypto out.
[Matt (Speaker 1)]: Oh, man. They might have, right? They might have, like, pulled that information out of that data mine before dumping it on the public. We'll see. We'll see.
[Dr. K (Speaker 2)]: I mean, you'd probably see, like, on-chain activity, like, flag. That'd be pretty funny, actually. You should, like, get a bunch of remote workers into your organization and reverse hack
[Matt (Speaker 1)]: Them. Oh, man.
[Dr. K (Speaker 2)]: People don't know about
[Matt (Speaker 1)]: This. A honeypot employer. Yeah, a honeypot employer.
[Dr. K (Speaker 2)]: A lot of remote employees that are tech workers are actually North Koreans. And some of them do good work. For like a long time. But the whole point is that they like build trust and then, you know, use it as a mechanism to attack, you know, companies and systems. So it's, it's funny. There's, there's been people saying, you know, how do you screen for the North Koreans? And you have to say like, you gotta be like Kim Jong-un sucks or like whatever. They like won't say it. Yeah.
[Matt (Speaker 1)]: To kind of round up this conversation, Veronica had a great question in chat that the community agrees is a great question as well. So Monero's hash rate is what it is. What other chains are kind of vulnerable to this attack? Bitcoin was the one that Veronica asked. My initial assumption is just like there's too much hash rate in Bitcoin for anybody to perform this attack successfully. But what are your thoughts, Dr. K, Jonathan? Are any other tokens vulnerable to this?
[Dr. K (Speaker 2)]: Well, I mean, at some level, every proof of work token is vulnerable right so the goal though like is that the hash rate sort of grows with the economic like nature of the chain so like ideally what you're looking at over time then is you know bitcoin is secure say for the fact that all the asics come from like one company But I mean, and the same is actually true about Kaspa.
[Matt (Speaker 1)]: Wink, wink, nod, safer, more secure, because they all come from one company.

[Dr. K (Speaker 2)]: Well, I mean, it has a higher, you know, hash number, right? So obviously a smaller project like Qubit could come close to attacking that big of a
[Matt (Speaker 1)]: That makes sense. Really, the size of the hash
[Dr. K (Speaker 2)]: Rate. Yeah, from
[Matt (Speaker 1)]: That. The size of the hash rate and the lack of work shares is what really makes you vulnerable to this. Yep. Okay. Man. Dang. It's an interesting day in crypto today. Or at least for me, this has been going on for a while, but it hit home just now. Jonathan, thank you so much for that link That really helped me wrap my head around it. Looks like other folks.
[Dr. K (Speaker 2)]: Do you have any comments, Jonathan, on this?
[Speaker 3]: Well, yeah, I mean, as I described, there's a scheme in which you can kind of solve this issue. I mean, work shares obviously make it harder for a sub-51%
[Dr. K (Speaker 2)]: Adversary to compromise security.
[Speaker 3]: And I guess liveness from the transaction perspective, I mean, you know at least we can say that like there's two there's two things right so one there's like work shares which make an adversary make their adversaries job a lot more difficult but if they have 51 like that's another problem which they easily could i mean if you look at their hash rate versus hours like they could the other one is you know having some kind of slashing mechanism Not in the consensus layer, but rather in the wallet or transaction layer. You know, you could make that a smart contract. You could make that, you know, a protocol native smart contract or something. But, yeah, I mean, there's ways to do it, I think, outside of the consensus layer, but it would involve some kind of slashing, which, you know, it might be worth to explore
[Dr. K (Speaker 2)]: If, you know, there's an avenue. Actually, you could do... We could do permissionless permissioning. I don't know what that means. So, so, so like what, so it's like the, the, the issue is like empties, right? So as long as like you're cooperatively building on non these, like you could rate, like in the same way that we can look at this graph and tell that like some people are fucking this graph and some people aren't right. You could come up with a protocol, like waiting strategy to figure out like who has sufficient reputation to participate, who doesn't.
[Matt (Speaker 1)]: I mean, I guess a simple filter would be. Blocks with transactions in them.
[Dr. K (Speaker 2)]: Well, no, no, it's the same thing. It's not necessarily blocks that don't have transactions in them. It's a chain of blocks that don't have transactions. And then what you force them to do is put transactions in their blocks. Now they would say, okay, we're going to put only our transactions in the block, not other people's transactions in the block to try to get around that. And then I guess you don't know who... It's like the good chain and the bad
[Matt (Speaker 1)]: Chain. What a cat and mouse game.
[Dr. K (Speaker 2)]: You could start to try to do classifying on it, and you could potentially do it in protocol. That's kind of what we're saying that is, right?
[Matt (Speaker 1)]: Yeah, that kind of sounds like a cat and mouse game at that point, which, you know, once you're headed down that path, I think the design's off. Yeah,
[Dr. K (Speaker 2)]: I mean, yes and no. I would be sympathetic to some things as, like, a temporary salve for this type of attack, you know? Sure. Right, like, so from my perspective, it's a, you know, Monero, it's like, whitelisting based off who had been mining, you know, a month ago for the last, you know, couple months. It's not as good of a solution as just adding work fairs. Right. But if that's like their only choice, they should do that.
[Speaker 3]: Right. You could actually, because tokens are locked for so long, I think you could probably, Well, actually, I mean, one thing you can say for sure is that the two-week lock would, you know, make them less likely to do it because if they do it and the attack is successful, like, if they have more than 51%, you know, the value of the token would go down, so their rewards would go down, like, proportionally. So that's one thing you could say is that, well, like, that lockup might actually prevent an attacker from wanting to do this because their profits would be lower. Well, that's a good point. That's obviously only mining rewards, but... The mining rewards would be lower. Now, if they did a double-spin attack, that's another thing. But I think it might be interesting to say, if there are two competing forks and it's publicly known, then could you prove that an adversary intentionally ignored a very long-running fork? Like, is it possible to construct a proof of that? Right.
[Dr. K (Speaker 2)]: That you can work shares, the workers kind of do that. Right. At some level, don't they?
[Speaker 3]: Yeah, I mean, I'm just saying in the 51% attack scenario, Yeah, I don't know. Maybe it's nothing. I was just thinking if there's a way to prove that there was a fork and then do something with that proof. But yeah, perhaps not, perhaps not. But certainly the two-week lockup actually helps in this case because their mining rewards would be worth less.
[Matt (Speaker 1)]: Well, you bring up a good point, though, Jonathan. I just thought about this. If Monero doesn't have that two-week lockup, aren't their rewards going down drastically quicker if they're dumping?
[Speaker 3]: I mean, their rewards are going down as they dump, but they get their rewards like instantly. Right. Okay.
[Matt (Speaker 1)]: Man, just a quick time check. We're 45 in, 15 to the top of the hour. We got a lot of people hanging out with us here on X. This is our weekly Tech AMA. Obviously, the topic of the hour is the liveliness attack on Monero. So if you're hanging out with us on Twitter, really appreciate you joining. We got some questions here in Discord on this topic. So I don't want to leave without getting to some of the questions the audience asked. Any other thoughts before we dive into some of these questions, team?
[Dr. K (Speaker 2)]: Yeah, no, let's go for it.
[Matt (Speaker 1)]: All right, rock and roll. Okay, so we discussed a whole lot about this attack, but Keisha was wondering if a miner claims their majority control is only a stress test to help the network. Oh, they're so benevolent. What objective technical and economic indicators can the community use to determine whether the activity is harmless research or an active security threat? I think dumping the tokens is one.
[Dr. K (Speaker 2)]: Sorry, any other
[Speaker 3]: Thoughts? Miners sell when miners want to sell. I mean, that's not necessarily heuristic. I think actually more importantly is, is it more profitable than mining, honestly? And the answer is yes. A selfish miner actually in the Monero and Bitcoin regime always makes more money than mining honestly. As long as they have, I believe, 25% of the hash, they always are more profitable mining selfishly. And you can see that. They are, you know, removing honest hash or honest blocks in favor of their own. I mean, Dr. K has researched this much more than me, but I know that Eyal Sirer, the selfish mining strategy, is provably more profitable for a selfish miner with at least 25% of the hash.
[Dr. K (Speaker 2)]: Yeah, no, that's right. The thing that's indicating they're not doing it, at least rationally, is that the blocks are empty. Ah. Right? So the selfish mining is actually the, like, correct outcome, given how they've structured incentives. But the empty blocks is the attack portion. Okay.
[Matt (Speaker 1)]: Okay. No, that makes perfect sense. Good points, guys. Cool. Next question. What's the technical difference between the reported six block reorg and a full 51%
[Dr. K (Speaker 2)]: Attack? Well, they don't actually have 51% of hash. So they can't run that. They can't run the longest chain at depth. They can only get lucky every now and again.
[Matt (Speaker 1)]: Simple enough. Got it. Got it.
[Dr. K (Speaker 2)]: Right. If they had 51%, they could do it for 100 blocks.
[Matt (Speaker 1)]: Makes sense.
[Speaker 3]: Makes sense. Right. And if they had 51%, the difficulty would go up. You would be able to see that in the difficulty chart because they'd be adding hash to the network to perform that attack. The difficulty would be going up, like, constantly, but it's not.
[Dr. K (Speaker 2)]: Oh, good call. You know, actually, like, the way that I would do this, to like, okay. So there's, there's a couple of ways you could temporarily like fix this problem. The best one from an era straight up is worships. They just do work shares. It's instantaneously goes away. Another one to do would be to permission, like the miners from when people weren't being dishonest into the system and disallow everybody else, but another thing you could do how would you do that is you could have i guess you just go back on the chain and you say like a month ago let's go back from month one to three take all of the coinbase producers over that two month period and wipe this them as producers
[Speaker 3]: So i can't use a new address to mine a block
[Dr. K (Speaker 2)]: Yeah that's it i'm not saying it's perfect i'm just saying like the different ways you could go about this Yeah. Right. And then the third way you could actually do it is you could have a real time validator set and you could permission a committee and the committee could basically like actively say like, oh, this is a fork block. Don't touch it. That's the other way you could do
[Speaker 3]: It. A committee determines which one is honest, which is not. I don't know how you do that either.
[Dr. K (Speaker 2)]: Well, no, it'd be at depth. So, like, it's basically, like, creating, like, a time lord of sorts, right? So, like, let's say you're running a node and I'm running a node and, you know, ZeroMinders is running a node and the RPCs are running a node and they all have permission keys, right? Basically, when they see, like, a thing at depth, like, over a certain depth of attack... They would basically say like, oh, I saw this super late. This is clearly an attack. Everyone treat this as a fork, block, don't touch it. And they would just broadcast fork
[Matt (Speaker 1)]: Flocks. Proof of stake on top of proof of work.
[Dr. K (Speaker 2)]: No, it wouldn't actually be stake. It's like a temporary mechanism to... You know, like I'll be at this type of attack under, you know, certain economic attributes.
[Matt (Speaker 1)]: I just see that slipping slope there. Like once you have validators, Oh man.
[Speaker 3]: What does late mean by, by the way? you mean if I, if I mine privately and submit a private chain to you, what if I do it publicly?
[Dr. K (Speaker 2)]: So, If it's public, then it's not a problem. You're cooperatively mining. No, I
[Speaker 3]: Can uncooperatively mine publicly. I can just mine my own chain, but I can do it
[Dr. K (Speaker 2)]: Publicly. No, you can't. If you're just mining empties, then you don't significantly impact liveness because every other block is an empty. It doesn't really matter. The problem is if you have these stretches of empties, that's the problem. So basically what you're saying is if you're late on block arrival, it means that you were purposely mining a stretch, which is private mining. Because if you were broadcasting them, people would just cooperatively be going on that chain. The only way they don't know about them is because you're not sharing them. No, no, no. If there's a long-ass fork at death, you weren't sharing the blocks as you were creating them. And so then this validator set would just basically be attesting to that, saying, these guys are fucking attacking the chain. I can tell. Here's my signature. That's
[Speaker 3]: It. But why can't I broadcast my own blocks and just ignore everybody else's? Like, I basically continue mining on my own blocks, but I ignore everyone else's. But I can broadcast them.
[Dr. K (Speaker 2)]: Oh, so like selfish money over 51% of the hash rate. Yeah.
[Speaker 3]: Well, I don't think you'd need 51%, right? It's all probabilistic, right? So
[Dr. K (Speaker 2)]: I would just get, no, you, you, you would, you wouldn't need 51%. So, so you would broadcast the blocks and just ignore everyone else. It's building on you. I don't know what you're saying. Yeah. Okay. Yeah, sure. Yeah, I don't know if there's much you could do there. But, I mean, if they're including transactions, does that matter? Well, this is actually
[Speaker 3]: Going to be my final question to you, and I'll let you all ponder this question. Is it a dominant strategy incentive-compatible outcome for the majority or perhaps a minority, a combination of minority to collude? to get 51% and to kick out the 49%. Because if there's like
[Dr. K (Speaker 2)]: Three pools who
[Speaker 3]: Have in total 51%, they could collude, right? And they would make more money colluding Because they'd be kicking out the rewards from the other 49%. So is it, if there are, you know, parties that could collude to become 51%, is it a dominant strategy and set a compatible outcome for them to collude? And is it inevitable for Bitcoin, for example, for mining pools to collude because it's more profitable for them to kick out the 49%? Ooh, I like this
[Matt (Speaker 1)]: Question. Thanks.
[Dr. K (Speaker 2)]: That's a good question.
[Matt (Speaker 1)]: I don't know. It's a great question. I'm afraid to answer. Can we ponder that and get to another community question? I love that question. Yeah, let's
[Dr. K (Speaker 2)]: Do community
[Matt (Speaker 1)]: Questions too. Let's ponder that one. Okay, so still on this topic, but also a great question here. Keisha was wondering, what is the Oh, in practical terms, how much reorganization depth would start threatening Quai Network's reliability?
[Dr. K (Speaker 2)]: Sorry, say
[Matt (Speaker 1)]: That again? How much reorganizational depth would start threatening Quai Network's reliability? I might rephrase that, like, how much reorg depth   threatens
[Dr. K (Speaker 2)]: It's it's it's not about deaths it's about percentage of hash rate
[Matt (Speaker 1)]: Percentage of hash rate okay and and that's strictly speaking to Quai Network or is that true for other proof-of-work networks as
[Dr. K (Speaker 2)]: Well so basically with work shares so every proof-of-work network like has a problem over 51 percent like bad acting right with board shares, client network makes it so it's actually 51%. Other networks get severe impingement even at minority fractions of bad actors because they don't have board shares. With board shares, you like actually get to that 51% threshold. Are you getting very close? Got it. Okay.
[Matt (Speaker 1)]: Okay. Great question. Yeah, I kept hearing about this 51% attack happening on Monero. But clearly at this point, it looks like that is not happening. However, they are successfully attacking the liveliness of transactions on Monero. Is that a fair statement?
[Dr. K (Speaker 2)]: Yeah, that's what they're hurting right now. It's just like your ability to do transactions.
[Matt (Speaker 1)]: Okay. Yeah. Based on the block Explorer, Jonathan shared. And how we understand these things that work, it's clear 51%, they're far, far away from 51%. But they are effectively reordering at depths of six blocks, it looks like. Okay. Cool. All right. Let's see here. There's an interesting screenshot from Telegram. 

Yeah okay nothing new there sorry scrolling down we had a question on lmts i'm trying to find   but the chat just they're they're hot on this topic   obviously   okay we'll get this one out not on not on this topic but about lmts which everybody's super excited about coming soon it's Quai Network thanks to our partner lithium d5 

Keith was wondering how does the team now view the future and role of. And following the mica approval has this milestone changed your outlook on their adoption, regulatory positioning or overall impact on the digital asset ecosystem.
[Dr. K (Speaker 2)]: Yeah, so just so, like, people know Micah is. Like a regulatory sort of regime that has been put in place for the Shenzhen zone. So EU, it's the Shenzhen actually. And yeah, basically like what it means is they kind of like do a classification on tokens and depending on the type of classification and, you know, if you have different sort of like disclosure requirements, and then once you sort of like meet those disclosure requirements, they approve you for sort of trading within that area. So as future listings are coming up, we obviously want those to be available in as broad a pair as possible, right? And, you know, listing and being able to trade not just in the U.S., say, on like a Kraken, but also being able to trade in Europe is obviously favorable for us. So it really is just getting access to the Shenzhen region as we get listed in more places.
[Matt (Speaker 1)]: Nice. Heck
[Dr. K (Speaker 2)]: Yeah. I will say, too, That the mic only
[Matt (Speaker 1)]: Applies to Quai. Right. Right. Yeah. Good clarification there, man. People,  , I was hanging out on discord last night and, and people are really excited about G. It's coming soon. No, it's, it's live today. But, supply is small. So go get it now. More news on that coming soon. But big news for Quai the micah compliance huge  that definitely sets us up for a more successful listing with kraken in the near future we are on their roadmap that   frankly is all the questions in the chat currently we are a little over time now so do you guys have any final thoughts before we wrap up anything else you wanted to cover
[Dr. K (Speaker 2)]: We
[Matt (Speaker 1)]: Can do that last question. Sure. Okay. Yeah. So Kishore, let me read it out for the Twitter audience here. Kishore mentions Crypto Daddy was meaning to ask this question. Recently, Shai publicly stated that he has disdain for Casper devs and community, but still considers Casper the most viable tech in the space. In a discussion with a Quai Nation member, he challenged them to give one concrete reason why Quai is superior to Kaspa, dismissing their points as unverifiable. Given this context, how would you address Shai's challenge? What specific verifiable advantage does Quai have over Kaspa? Ooh, ooh, I want to chime in. Programmability. That's my answer.
[Dr. K (Speaker 2)]: Hey, are you there? You broke up for a second.
[Matt (Speaker 1)]: Oh, no. Did you get the whole question?
[Dr. K (Speaker 2)]: Yeah, dismissing their points as
[Matt (Speaker 1)]: Unverifiable. What would you say is the specific verifiable advantage Quai has over Kaspa? My answer was smart
[Dr. K (Speaker 2)]: Contracts. Oh, yeah. I mean, smart contracts is obviously one of them. This is actually the first sort of debate that I had with Shai a long time ago. Was basically saying that Castro isn't really set up to do smart contracting in L1 because of sort of the N squared computational complexity of resolving conflicting state transitions that arise from their unstructured tags. And he's like, no, we can use smart contracts. And then you keep digging. It's like, we can use smart contracts in the L2. OK. So obviously, smart contracts in the L1 is one of those advantages. 

The other thing here is, you know how you classify that unverifiable statement? Right. That basically is one of the reasons that we're working with Shai. I am slowly trying to make that unverifiable become verifiable, specifically around work shares and the implication that work shares have on finality and liveness. So the process of working with Shai isn't just a process of getting educational materials out to the public. It's also the process of me trying to convince Shai of something. So we're like midway through that stream, but I'm thinking we'll get him there. Heck yeah. So the unverifiable piece, which I'm trying to conclusively convince him of, is twofold. One is that a structured DAG Sorry, well, maybe I should say this. A DAG which has maximal anti-chain is better than one that has less. That would be, like, the statement. I'm trying to convince him. And then if you look at Quai versus Casper, Quai has more anti-chain. So with the same sort of network... Resources because it has more anti-chain, it can get faster consensus with the same resource input. That's like stated one that I'm trying to get into mouth. Statement two is, when it comes to the consensus algorithm itself, the algorithm which converges to the CRLB is optimal. So for a given graph, we can compare two graphs and say this is better than that. And for two algorithms, we can say on a given graph, we can say this algorithm is better than that algorithm. So then if you have a optimally efficient algorithm, on a graph that is better than another graph you have a better system so like that is the the evolution that i'm trying to get him through but for shy to be verifiable you have to do it a very rigorous way fair
[Matt (Speaker 1)]: And and respect right we like rigor heck
[Dr. K (Speaker 2)]: Yeah yeah i mean i mean you know i   I'm like different than a lot of the academics kind of work off intuition and experiment and then circle back on the mathematics of it. I don't think that the mathematics like allow you to see things as quickly. So you know that's that's just like kind of how we operate but mathematics takes so much longer to rigorously figure out that if you're trying to innovate with formal proving it would take you like years so i'm definitely glad we we experiment and like run off a little bit of intuition  , before we formally prove things, but I'm. It's pretty close to thinking I can get him to like. We'll see, maybe it's going to take me another, like, 2 months, 3 months. I don't know. Maybe a month, but yeah, like, part of my goal. With him creating content on work shares is to convince some of these 2 things.
[Matt (Speaker 1)]: Nice great question. Keisha. I really appreciate. That answer, Dr. K. I'll just also state, even with that method, it still took us years to get to main net. So I think, you know, that balance is really nice, actually. You know, you're building, you're testing, you're running off of intuition, but still focusing on delivering something that doesn't need a roadmap. Yeah, I mean,
[Dr. K (Speaker 2)]: You know, you circle back on the math, right? Right. Like, there's different degrees of, like, proving and, like, the certainty in proving. And what I have found is that, like, I can intuitively get pretty fucking close. So, like, for example, with horses, as I, like, get to the math... I think the thing we screwed up is the weight of a block relative to the share. But that's sort of it.
[Matt (Speaker 1)]: And that's, dare I say, in terms of time and effort and immaterial change to the protocol as it currently stands compared to you know, focusing on the math and never delivering something or, you know, going off of pure intuition and never doing any rigor at all, and delivering something completely broken, real quick. I like the balance.
[Dr. K (Speaker 2)]: Yeah. Yeah. So, so anyway, you know, I, I think, you know, shy is an open-minded person. And, you know, I think the caveat in his statement is, like, where he is and that the sort of advanced use have not yet been verified. So, working on it, boys. Working on it.
[Matt (Speaker 1)]: Yeah. Stay tuned for more. Appreciate that, Dr. K. Jonathan, any final thoughts?
[Speaker 3]: No, it was an interesting discussion. Thank you guys for tuning in and look forward to seeing you guys on the space tomorrow with Shai.
[Matt (Speaker 1)]: Boom. Heck
[Dr. K (Speaker 2)]: Yeah. Yeah, we'll see on that, by the way. I don't know. I'm in DS right now with Vlad. He's like, someone just canceled.
[Matt (Speaker 1)]:  -oh.
[Dr. K (Speaker 2)]: I don't know. Yeah, we'll see if, like, the Vlad thing takes place tomorrow or not.
[Matt (Speaker 1)]: Keep
[Speaker 3]: An eye out. Shai, we have a space with him tomorrow.
[Dr. K (Speaker 2)]: No, I know, but Vlad is saying that he could fit me in tomorrow. So, like, if that's when we got to do it, that's when we got to do it. At the same time? Yeah. Well, he wants to do, like, a marathon, right? So, it's going to be, like, a whole day. Oh,
[Speaker 3]: I see. He can't give you, like, 30 minutes?
[Dr. K (Speaker 2)]: To, like, context switch? Yeah, I mean, we can try. That's not really his format. You know, obviously, I think it's easier to reschedule shy than it would be to do Vlad. So it's like Vlad's not fit us in. We should just do it.
[Speaker 3]: Okay.
[Dr. K (Speaker 2)]: Fair enough. Great. And he definitely, like, has a cross-study audience that, like, isn't fully aware of us. Maybe
[Matt (Speaker 1)]: We just invite Vlad to the space. Veronica just mentioned that. We'll
[Dr. K (Speaker 2)]: Figure it out. Yeah, I think it's interesting
[Speaker 3]: That Chai is actually directly involved in this whole 51% attack drama. He's been, I don't know, paid or something by Qubic to audit their results. So he's actually going to look at the blocks that they've mined and publicly verify whether they indeed have 51% of the hash rate or not
[Dr. K (Speaker 2)]: Somehow. So the team is actually like,
[Speaker 3]: Part of it sort of like not the attack per se but it's just like   the timing is interesting
[Matt (Speaker 1)]: Super interesting
[Dr. K (Speaker 2)]: Yeah i mean try is gonna literally stay like what we just said right it's cool you can get money for it yeah probably right like good for him but oh man yeah anyway
[Matt (Speaker 1)]: Well Man, we got so much going on over here, both inside and adjacent to Quai Network. Interesting, interesting times. I was telling Christopher earlier today, I've been on a new high for like the last month. We got so much going on, so many big things lined up. Really grateful to be here, guys. Thank you so much for the time and the thoughts today. It's a super interesting conversation. I'm going to have to spend more time looking into it.  , I know a number of our community members are diving in as well. The chat's on fire. The, the comments on Twitter are absolutely amazing. 

So thanks so much,  , for the time today. Don't, don't mean to cut you off. So, what, one last, one last,  , thought, or are we good to wrap up? 

No, we're good. Thanks everyone for coming. Yeah.
[Dr. K (Speaker 2)]: I just thought it would be topical to talk about Monero today.
[Matt (Speaker 1)]: Super topical.
[Dr. K (Speaker 2)]: Also, yeah, and you'll do all the housekeeping. But yeah, I hope people learn something because it is showing sort of the practical benefit of orchards.
[Matt (Speaker 1)]: Bingo. Bingo. Really looking forward to the the hindsight on everything that's happening in the space today and recently  we got some more content planned for you all on this topic and you know even deeper dives maybe some surface level exploration as well in the very near future obviously Team is working, to get shy on a space with Dr. K, to talk through more of everything happening and proof of work currently tentatively scheduled for tomorrow. So keep your eyes peeled for that. 

The tweet is up. As Dr. Kate mentioned, we should also be doing a marathon here pretty soon with, Vlad the Costea, on the Bitcoin takeover podcast. That's always a fun format. He was, really really  a bitcoin maxi i believe until vegas last year where he pivoted to privacy tokens it's been fun watching him on his journey and learning along with him so keep your eyes peeled for that we got some big announcements coming out today   so if you've been hanging on for the tangent pre-order   that's live it's it's up it's ready to go   i think we might Have a tweet out on that currently. If not, I know Veronica's hot on it. 

There it is. It's pinned in the Twitter space. Folks, go get your hands on the coolest freaking hardware wallet I have ever seen. I'm super excited to get my hands on some. They should be shipping really, really soon. But first, you got to get your pre-orders in. There's a big discount. For the Quai limited edition tangent wallet So good go get your hands on that man. I'm so excited. I'm stuttering over here. That thing's super cool I'm gonna kick my ledger to the side once I get my hands on this but go check that out if you're new around here We got much more planned in the very near future. I'm talking in sexes Dex's bridges other partners like lithium defy industry first Tokenized yield on a proof of work network. That's right around the corner. So keep your eyes peeled for that. We're on the crack and roadmap. If you're trying to get your hands on some Quai today, you can snag some from MEXC, Gate io or L Bank. I did a swap on Let's Exchange over the weekend. That was a pretty good experience. So many ways to get your hands on some Quai. Veronica's got even more ways. If you haven't tried out Kipper money, just get to, you can get some Quai just by onboarding to Kipper money. So check it out. We got some links in the chat for you all hanging out with us on discord. We do this every Wednesday, simulcasted from discord. So if you're not in our discord and you have some Quai tap into the discord, we got some roles for you all join the Quai Nation. We're going places. You are still early. And keep your eyes peeled for more spaces with Dr. K, Shai, the Vlad Costea Bitcoin Takeover podcast. And I think we're actually chatting with Tangent this Friday as well. So really excited for all this content coming out. You heard it here first. Go get your hands on that wallet, man. There's very limited supply, only 500. So the sooner the better. Big discount for you. I'm rambling at this point. It was so much fun. Really appreciate everybody tuning in. Thank you so much. We will catch you tomorrow, either with Shai or Vlad, and see you again on Friday as well. If you missed out, we do this every Wednesday. So catch you all next week. Thanks so much, team. Bye-bye, bye-bye.


[01] [Q&A] 2025-08-13 Tech AMA with Dr K - Monero 51 Attack
Tech AMA with Dr. K — Monero / Qubic 51% Attack — 2025-08-13
Source: 2025-08-13 Tech AMA with Dr K - Monero 51 Attack.m4a (~68 min) Host: Matt (Quai Network) Featured guests: Dr. K, Jonathan Format: X Space / Discord discussion Headline: Dr. K explains why Qubic's Monero behavior is better understood as a sub-51% liveness / reorg attack, why Workshares make that class of attack much harder, and how the same discussion relates to Quai, Kaspa, MiCA, LMTs, and Proof-of-Work design.

Notes on this transcript 

Token / tech names normalized: Quai (often transcribed as "kawaii", "quiet", "why"), Qi (often "chi"), Qubic (often "Cubic"), Monero, Kaspa, MiCA, LMTs, Workshares, PoW.
The Monero visualizer discussed is moneroconsensus.info.
Timestamps [HH:MM:SS] mark where to skip in the audio.


Table of Contents
Monero / Qubic Attack Analysis
What is Qubic doing to Monero? [00:00:07]
Is this actually a 51% attack? [00:03:44]
What are the red empty blocks on the Monero visualizer? [00:07:51]
How would Workshares change the attack economics? [00:10:08]
Could Monero fix this by adopting Workshares? [00:20:50]
Would special wallets, collateral, or block-fill rules help with double-spend risk? [00:15:07]
What reorg depth would threaten Quai's reliability? [00:45:36]
Quai / Ecosystem Strategy
What does MiCA approval mean for Quai, Qi, and LMTs? [00:48:21]
What verifiable advantage does Quai have over Kaspa? [00:51:31]
Why work with Shai on Workshare content? [00:53:24]
Closing / Community Updates
What follow-up content was planned after this Space? [01:01:28]
What product/community updates were mentioned at the close? [01:03:55]


Q&A

1. What is Qubic doing to Monero?
Asked by: Matt — [00:00:07]

Dr. K:

Qubic uses an epoch-style mining setup. During parts of that process, it appears to merge-mine other tokens, sell those rewards, and buy Qubic.
In Monero's case, Qubic has accumulated enough hash rate to repeatedly create competing branches.
Dr. K's read: Qubic is not doing useful AI inference despite marketing claims; it is effectively a GPU mining algorithm whose "AI" framing is not supported by the codebase.
The practical behavior is that Qubic mines Monero blocks in a way that can disrupt transaction inclusion and finality assumptions.



2. Is this actually a 51% attack?
Asked by: Matt / community — [00:03:44]

Answer (Dr. K): Not in the strict sense, based on the discussion. Qubic does not appear to have 51% of Monero hash rate. It is closer to a sub-51% liveness attack:

With roughly minority hashrate, Qubic can still get lucky across a short window of a few Monero blocks.
By privately mining a branch and revealing it if it becomes longer than the public chain, Qubic can cause reorgs.
The attack does not require permanent majority control; it exploits variance over a small sample size.
The main harm is uncertainty around when a Monero transaction should be considered reliably final.

Practical exchange response: increase confirmation windows. Instead of accepting after a small number of blocks, exchanges can wait much longer to reduce risk.



3. What are the red empty blocks on the Monero visualizer?
Asked by: Matt — [00:07:51]

Answer (Dr. K / Jonathan):

On the visualizer, green blocks were interpreted as regular blocks and red blocks as unknown / non-standard mining sources.
The key pattern is not a single red empty block. The suspicious pattern is multiple red circle blocks in a row inside a reorg.
Dr. K's read: chains of red empty blocks that reorg regular transaction-containing blocks are very likely Qubic.
Empty red blocks that simply extend the chain without causing a reorg could be ordinary empty blocks and should not automatically be attributed to Qubic.



4. How would Workshares change the attack economics?
Asked by: Matt / community — [00:10:08]

Dr. K:

Linear PoW chains like Monero or Bitcoin only sample hash rate once per block.
If Monero blocks are around two minutes, then six blocks is roughly 12 minutes and still only six samples of the mining population.
That small sample size lets a 25% miner sometimes look like a majority over a short window.
Quai's Workshare model samples hash rate much more frequently. In a 5-second block, Quai can collect many lower-difficulty workshare samples.
More samples reduce variance and make it much harder for a minority miner to appear like a majority.

Core point: Workshares do not remove the possibility of a real 51% attack, but they make the attacker actually need something near 51% hashrate rather than exploiting short-window variance.



5. Could Monero fix this by adopting Workshares?
Asked by: Matt — [00:20:50]

Dr. K: Yes, in principle. If Monero adopted a Workshare design, a sub-51% attack like the one being discussed would become infeasible as long as Qubic remained below majority hashrate.

Marketing / implementation angle: Dr. K suggested that the strongest way to demonstrate this would be an actual PR or implementation path, not only an article. He was cautious about inviting extra adversarial attention to Quai, but the technical claim was clear: Workshares directly address the variance problem exposed by this Monero episode.



6. Would special wallets, collateral, or block-fill rules help with double-spend risk?
Asked by: Matt / Dr. K discussion — [00:15:07]

Dr. K:

One theoretical mitigation is a wallet scheme where double-signing or conflicting use of the same nonce creates a penalty or causes funds to be taken.
That likely requires either collateral or delayed finality for the recipient.
Another idea is to adjust economics around block fill: if attackers are mining empty blocks, a protocol could potentially avoid paying rewards below a certain transaction-fill threshold.
These are more speculative mitigations. The simpler architectural fix for the specific sub-51% reorg/liveness problem is better hashrate sampling via Workshares.



7. What reorg depth would threaten Quai's reliability?
Asked by: Kishore — [00:45:36]

Answer (Dr. K): For Quai, the key variable is not reorg depth in isolation; it is percentage of adversarial hashrate.

Every PoW network has a problem if a bad actor controls more than 51%.
Networks without Workshares can see serious liveness degradation from minority hash because their sampling is sparse.
Quai's Workshare structure pushes the practical attack threshold much closer to the real 51% line.
So the reliability question should be framed as "how much adversarial hashrate exists?" rather than "how many blocks deep was the reorg?"



8. What does MiCA approval mean for Quai, Qi, and LMTs?
Asked by: Kishore — [00:48:21]

Dr. K:

MiCA is the EU regulatory framework for token classification and disclosure.
Meeting those requirements helps assets become tradable across the European / Schengen market.
The milestone matters because future exchange listings should be accessible to as broad a market as possible, including Europe.
Dr. K clarified that the MiCA point applied only to Quai and not Qi.
Matt: Connected the point to upcoming exchange access, especially Kraken, and noted community excitement around QI / LMTs.



9. What verifiable advantage does Quai have over Kaspa?
Asked by: Kishore, relaying Crypto Daddy / Shai challenge — [00:51:31]

Matt's immediate answer: L1 programmability / smart contracts.

Dr. K:

Smart contracts are the obvious advantage. Dr. K argued that Kaspa is not naturally set up for L1 smart contracts because resolving conflicting state transitions in an unstructured DAG creates difficult computational complexity.
The deeper technical claim is that Quai's structured DAG and higher anti-chain capacity let it achieve faster consensus with the same network resources.
Dr. K also argued that Quai's consensus algorithm is closer to an optimal estimator for the graph it operates on.

Short version: Quai combines L1 smart contracts with a structured DAG / Workshare consensus design that Dr. K believes can be made rigorously verifiable against Kaspa's architecture.



10. Why work with Shai on workshare content?
Asked by: Matt — [00:53:24]

Dr. K:

Shai is rigorous and open-minded, but some of Quai's claimed advantages are not yet presented in a form he considers fully verifiable.
Part of the content collaboration is educational, but part of it is also Dr. K trying to convince Shai through formal reasoning.
The two claims Dr. K wants to make rigorous:
A DAG with greater maximum anti-chain is superior for the same network resources.
An algorithm that converges to the CRLB / optimal estimator on that graph is better than a less efficient algorithm on a weaker graph.
Dr. K emphasized a practical research style: build from intuition and experiment, then circle back with formal proof.



11. What follow-up content was planned after this Space?
Discussed at: [01:01:28]

Answer:

A follow-up Space with Shai was tentatively planned to discuss Workshares and the Monero/Qubic situation.
Dr. K also mentioned a possible Bitcoin Takeover / Vlad Costea appearance.
Shai was expected to examine Qubic's claims around Monero hashrate and attack behavior, which made the timing especially relevant.



12. What product/community updates were mentioned at the close?
Discussed at: [01:03:55]

Answer (Matt):

Quai had more content planned around Monero, Qubic, Workshares, and Proof-of-Work.
The limited-edition Tangem / Quai hardware wallet pre-order was live, with a limited supply.
More ecosystem items were teased: CEXs, DEXs, bridges, Lithium DeFi, and tokenized yield on a PoW network.
Discord roles and community participation were promoted for holders and active community members.


Notable Asides
Dr. K repeatedly framed the Monero issue as a liveness problem rather than a successful majority takeover.
The visual pattern to watch was reorg chains of empty blocks, not isolated empty blocks.
Workshares were presented as a practical defense against minority-hash reorg variance, not a magic defense against true majority control.
Dr. K acknowledged that Quai's mathematical proofs and formal comparisons are still being written up, even though the team has been operating from intuition, experiments, and implementation experience.


[01] [Summary] Aug 13, 2025 Tech AMA with Dr. K - Monero 51% Attack
Meeting: Discussion on Qubic's Impact on Monero
Overview of Qubic's Mining Strategy
Qubic utilizes a unique mining algorithm that allows for merge mining with Monero.
They are reportedly mining Monero and not distributing rewards to their miners, creating concerns about their project's legitimacy.
They engage in potential liveness attacks by creating forks in the Monero blockchain, leading to transaction delays.
This behavior raises issues about the integrity of Monero's transaction finality.
Technical Analysis of the Attack
Dr. K explained how Qubic's strategy can successfully execute reorg attacks without having 51% hash power.
The risks posed by Qubic's actions could be mitigated if Monero adopted work shares, which would prevent sub-51% attacks from being feasible.
Work shares allow faster and more accurate sampling of the blockchain, enhancing security against such attacks.
Future Considerations and Next Steps
Discussion on potential solutions for Monero, including the adoption of work shares and risk management strategies by exchanges.
Importance of monitoring Qubic's activities and implications for the broader crypto landscape, particularly for proof-of-work networks.
Encouragement to document findings and potentially publish a paper addressing these issues and solutions.


